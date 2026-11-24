import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Reuse one pool across hot reloads in development.
const g = globalThis;
const pool =
  g.__sushiPgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
if (process.env.NODE_ENV !== 'production') g.__sushiPgPool = pool;

export const db = drizzle(pool, { schema });
export { schema };
