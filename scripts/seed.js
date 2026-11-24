// Seeds starter content (categories, services, testimonials) carried over
// from the original Django database. Safe to run more than once.
import { config } from 'dotenv';
import pg from 'pg';
import { readFileSync } from 'node:fs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { categories, services, testimonials } from '../src/db/schema.js';

config({ path: ['.env.local', '.env'], quiet: true });

const data = JSON.parse(readFileSync(new URL('./seed-data.json', import.meta.url), 'utf8'));
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

try {
  await db.insert(categories).values(data.categories).onConflictDoNothing({ target: categories.slug });
  await db.insert(services).values(data.services).onConflictDoNothing({ target: services.slug });

  const existing = await db.select({ id: testimonials.id }).from(testimonials).limit(1);
  if (existing.length === 0) await db.insert(testimonials).values(data.testimonials);

  console.log(`✓ Seeded ${data.categories.length} categories, ${data.services.length} services, ${data.testimonials.length} testimonials`);
} catch (err) {
  console.error('✗ Seed failed:', err.cause?.message ?? err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
