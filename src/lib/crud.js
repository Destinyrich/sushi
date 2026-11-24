// Generic admin CRUD for a "resource" (table + validation schema + file fields).
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { withAdmin } from './auth';
import { ApiError, json, parse, parseId, readBody } from './validate';
import { removeUpload, saveUpload } from './media';

/**
 * resource = {
 *   table, schema, files: { column: { folder, required? } },
 *   list(), get(id),
 *   prepare?(data, { id, existing }),   // async: tweak validated data (e.g. generate slug)
 *   beforeDelete?(existing),            // async: may throw ApiError to block deletion
 *   allow: ['list','create','update','delete']
 * }
 */
export function collectionRoute(res) {
  const allow = res.allow ?? ['list', 'create', 'update', 'delete'];
  const out = {};

  if (allow.includes('list')) {
    out.GET = withAdmin(async () => json(await res.list()));
  }

  if (allow.includes('create')) {
    out.POST = withAdmin(async (req) => {
      const { fields, files } = await readBody(req);
      const data = parse(fields, res.schema);
      if (res.prepare) await res.prepare(data, {});

      const fileSpec = res.files ?? {};
      const missing = {};
      for (const [col, spec] of Object.entries(fileSpec)) {
        if (spec.required && !files[col]) missing[col] = 'No file was submitted.';
      }
      if (Object.keys(missing).length) throw new ApiError(400, `${Object.keys(missing)[0]}: No file was submitted.`, missing);

      const saved = await saveFiles(files, fileSpec);
      try {
        const [row] = await db.insert(res.table).values({ ...data, ...saved }).returning({ id: res.table.id });
        return json(await res.get(row.id), 201);
      } catch (e) {
        await Promise.all(Object.values(saved).map(removeUpload));
        throw e;
      }
    });
  }
  return out;
}

export function itemRoute(res) {
  const allow = res.allow ?? ['list', 'create', 'update', 'delete'];
  const out = {};

  const load = async (ctx) => {
    const id = parseId((await ctx.params).id);
    const [existing] = await db.select().from(res.table).where(eq(res.table.id, id));
    if (!existing) throw new ApiError(404, 'Not found.');
    return { id, existing };
  };

  out.GET = withAdmin(async (_req, ctx) => {
    const { id } = await load(ctx);
    return json(await res.get(id));
  });

  if (allow.includes('update')) {
    out.PATCH = withAdmin(async (req, ctx) => {
      const { id, existing } = await load(ctx);
      const { fields, files } = await readBody(req);
      const data = parse(fields, res.schema, { partial: true });
      if (res.prepare) await res.prepare(data, { id, existing });

      const saved = await saveFiles(files, res.files ?? {});
      const changes = { ...data, ...saved };
      if (Object.keys(changes).length) {
        try {
          await db.update(res.table).set(changes).where(eq(res.table.id, id));
        } catch (e) {
          await Promise.all(Object.values(saved).map(removeUpload));
          throw e;
        }
        // The old image is no longer referenced.
        await Promise.all(Object.keys(saved).map((col) => removeUpload(existing[col])));
      }
      return json(await res.get(id));
    });
  }

  if (allow.includes('delete')) {
    out.DELETE = withAdmin(async (_req, ctx) => {
      const { id, existing } = await load(ctx);
      if (res.beforeDelete) await res.beforeDelete(existing);
      await db.delete(res.table).where(eq(res.table.id, id));
      await Promise.all(Object.keys(res.files ?? {}).map((col) => removeUpload(existing[col])));
      return new Response(null, { status: 204 });
    });
  }
  return out;
}

async function saveFiles(files, spec) {
  const saved = {};
  try {
    for (const [col, { folder }] of Object.entries(spec)) {
      if (files[col]) saved[col] = await saveUpload(files[col], folder);
    }
  } catch (e) {
    await Promise.all(Object.values(saved).map(removeUpload));
    throw e;
  }
  return saved;
}
