import { createSession, verifyCredentials } from '@/lib/auth';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { ApiError, handle, json, readBody } from '@/lib/validate';

export const POST = handle(async (req) => {
  if (!rateLimit(`login:${clientIp(req)}`, { limit: 10, windowMs: 15 * 60 * 1000 })) {
    throw new ApiError(429, 'Too many login attempts. Try again in a few minutes.');
  }

  const { fields } = await readBody(req);
  const user = await verifyCredentials(fields.username, fields.password);
  if (!user) throw new ApiError(400, 'Invalid credentials');

  const proto = req.headers.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '');
  await createSession(user, { secure: proto === 'https' });
  return json({ ok: true, username: user.username });
});
