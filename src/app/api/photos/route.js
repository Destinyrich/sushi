import { handle, json } from '@/lib/validate';
import { listPhotos } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const GET = handle(async (req) => {
  const p = new URL(req.url).searchParams;
  return json(await listPhotos({ category: p.get('category') || undefined, featured: !!p.get('featured') }));
});
