// Creates an admin user, or resets the password if the username exists.
//   npm run admin:create                      (uses ADMIN_USERNAME / ADMIN_PASSWORD from .env)
//   npm run admin:create -- lucky "s3cret!"   (explicit)
import { config } from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { adminUsers } from '../src/db/schema.js';

config({ path: ['.env.local', '.env'], quiet: true });

const username = process.argv[2] || process.env.ADMIN_USERNAME;
const password = process.argv[3] || process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error('Provide a username and password (args or ADMIN_USERNAME / ADMIN_PASSWORD env vars).');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

try {
  const password_hash = await bcrypt.hash(password, 12);
  await db.insert(adminUsers).values({ username, password_hash })
    .onConflictDoUpdate({ target: adminUsers.username, set: { password_hash } });
  console.log(`✓ Admin "${username}" is ready`);
} catch (err) {
  console.error('✗ Failed:', err.cause?.message ?? err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
