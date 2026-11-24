import { config } from 'dotenv';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

config({ path: ['.env.local', '.env'], quiet: true });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  await migrate(drizzle(pool), { migrationsFolder: './drizzle' });
  console.log('✓ Database migrated');
} catch (err) {
  console.error('✗ Migration failed:', err.cause?.message ?? err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
