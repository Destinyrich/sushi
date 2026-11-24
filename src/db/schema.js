import {
  pgTable, serial, varchar, text, boolean, integer, numeric,
  date, time, timestamp, index,
} from 'drizzle-orm/pg-core';

const createdAt = () =>
  timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

// ── Auth ─────────────────────────────────────────────────────────────────────
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 150 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  created_at: createdAt(),
});

// ── Portfolio ────────────────────────────────────────────────────────────────
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  description: text('description').notNull().default(''),
});

export const photos = pgTable('photos', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  category_id: integer('category_id').notNull().references(() => categories.id, { onDelete: 'restrict' }),
  image: varchar('image', { length: 500 }).notNull(),
  description: text('description').notNull().default(''),
  featured: boolean('featured').notNull().default(false),
  order: integer('sort_order').notNull().default(0),
  created_at: createdAt(),
}, (t) => [index('photos_category_idx').on(t.category_id)]);

/** Images in the homepage hero slideshow. */
export const heroSlides = pgTable('hero_slides', {
  id: serial('id').primaryKey(),
  image: varchar('image', { length: 500 }).notNull(),
  caption: varchar('caption', { length: 200 }).notNull().default(''),
  order: integer('sort_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: createdAt(),
});

/** The homepage gallery grid. span: normal (1×1) | tall (1×2) | wide (2×1) */
export const gallerySpots = pgTable('gallery_spots', {
  id: serial('id').primaryKey(),
  image: varchar('image', { length: 500 }).notNull(),
  title: varchar('title', { length: 200 }).notNull().default(''),
  span: varchar('span', { length: 10 }).notNull().default('normal'),
  order: integer('sort_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  client_name: varchar('client_name', { length: 100 }).notNull(),
  event_type: varchar('event_type', { length: 100 }).notNull(),
  message: text('message').notNull(),
  rating: integer('rating').notNull().default(5),
  photo: varchar('photo', { length: 500 }),
  created_at: createdAt(),
  is_featured: boolean('is_featured').notNull().default(false),
});

// ── Bookings ─────────────────────────────────────────────────────────────────
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  description: text('description').notNull(),
  price_from: numeric('price_from', { precision: 10, scale: 2 }).notNull(),
  duration: varchar('duration', { length: 100 }).notNull(),
  includes: text('includes').notNull().default(''), // comma-separated
  cover_image: varchar('cover_image', { length: 500 }),
  icon: varchar('icon', { length: 50 }).notNull().default('camera'),
  is_active: boolean('is_active').notNull().default(true),
});

export const BOOKING_STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  client_name: varchar('client_name', { length: 200 }).notNull(),
  client_email: varchar('client_email', { length: 254 }).notNull(),
  client_phone: varchar('client_phone', { length: 30 }).notNull(),
  service_id: integer('service_id').references(() => services.id, { onDelete: 'set null' }),
  event_type: varchar('event_type', { length: 200 }).notNull(),
  event_date: date('event_date').notNull(),
  event_time: time('event_time'),
  event_location: varchar('event_location', { length: 300 }).notNull(),
  guest_count: integer('guest_count').notNull().default(1),
  special_requests: text('special_requests').notNull().default(''),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  notes: text('notes').notNull().default(''),
  quoted_price: numeric('quoted_price', { precision: 10, scale: 2 }),
  created_at: createdAt(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => [
  index('bookings_status_idx').on(t.status),
  index('bookings_created_idx').on(t.created_at),
]);
