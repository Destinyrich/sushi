import { handle, json } from '@/lib/validate';
import { listServices } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const GET = handle(async (req) => {
  const p = new URL(req.url).searchParams;
  return json(await listServices());
});
