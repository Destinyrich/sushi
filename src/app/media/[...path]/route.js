import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { CONTENT_TYPES, resolveUploadPath } from '@/lib/media';

export const dynamic = 'force-dynamic';

// Serves uploaded images from UPLOAD_DIR at /media/<folder>/<file>.
export async function GET(_req, ctx) {
  const { path: segments } = await ctx.params;
  const rel = segments.join('/');
  const ext = path.extname(rel).slice(1).toLowerCase();
  const full = resolveUploadPath(rel);
  const type = CONTENT_TYPES[ext];

  if (!full || !type) return new Response('Not found', { status: 404 });

  try {
    const file = await readFile(full);
    return new Response(file, {
      headers: {
        'Content-Type': type,
        'Content-Length': String(file.length),
        'X-Content-Type-Options': 'nosniff',
        // Filenames are random UUIDs, so a given URL never changes content.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
