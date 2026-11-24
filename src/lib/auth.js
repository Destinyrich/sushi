import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import { ApiError, handle } from './validate';

export const SESSION_COOKIE = 'sushi_admin';
const SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 days

const secretKey = () => {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error('AUTH_SECRET must be set to a random string of at least 32 characters.');
  return new TextEncoder().encode(s);
};

// Used to keep login timing similar whether or not the username exists.
let dummyHash;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync('not-a-real-password', 12));

export async function verifyCredentials(username, password) {
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, String(username ?? '')));
  const ok = await bcrypt.compare(String(password ?? ''), user?.password_hash ?? getDummyHash());
  return ok && user ? user : null;
}

export async function createSession(user, { secure }) {
  const token = await new SignJWT({ username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(secretKey());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Returns { id, username } for a valid session cookie, otherwise null. */
export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    return { id: Number(payload.sub), username: payload.username };
  } catch {
    return null;
  }
}

/** Wrap an admin route handler: 401 unless a valid session cookie is present. */
export const withAdmin = (fn) =>
  handle(async (req, ctx) => {
    const session = await getSession();
    if (!session) throw new ApiError(401, 'Authentication required.');
    return fn(req, ctx, session);
  });
