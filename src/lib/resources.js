// Admin resource definitions: what each table accepts and how it's listed.
import { and, count, eq, ne } from 'drizzle-orm';
import { db } from '@/db';
import {
  bookings, BOOKING_STATUSES, categories, gallerySpots, heroSlides, photos, services, testimonials,
} from '@/db/schema';
import { S, ApiError } from './validate';
import { slugify } from './format';
import * as q from './queries';

/** Fill in / de-duplicate a slug. */
async function ensureSlug(table, data, { id, existing }, sourceField = 'name') {
  const given = data.slug !== undefined ? slugify(data.slug) : undefined;
  let base = given;
  if (!base) {
    // Creating without a slug (or clearing it): derive from the name.
    if (existing && given === undefined) return;
    base = slugify(data[sourceField] ?? existing?.[sourceField] ?? '') || 'item';
  }
  let slug = base;
  for (let n = 2; ; n++) {
    const clash = await db.select({ id: table.id }).from(table)
      .where(id ? and(eq(table.slug, slug), ne(table.id, id)) : eq(table.slug, slug)).limit(1);
    if (!clash.length) break;
    slug = `${base}-${n}`;
  }
  data.slug = slug;
}

export const categoryResource = {
  table: categories,
  schema: {
    name: S.str({ max: 100, required: true }),
    slug: S.str({ max: 120, default: '' }),
    description: S.str({ max: 2000, default: '' }),
  },
  list: q.listCategories,
  get: q.getCategory,
  prepare: (data, ctx) => ensureSlug(categories, data, ctx),
  async beforeDelete(existing) {
    const [{ n }] = await db.select({ n: count() }).from(photos).where(eq(photos.category_id, existing.id));
    if (n > 0) throw new ApiError(409, `This category still has ${n} photo${n === 1 ? '' : 's'}. Move or delete them first.`);
  },
};

export const photoResource = {
  table: photos,
  schema: {
    title: S.str({ max: 200, required: true }),
    category: S.fk({ as: 'category_id', required: true }),
    description: S.str({ max: 5000, default: '' }),
    featured: S.bool({ default: false }),
    order: S.int({ default: 0, min: -100000, max: 100000 }),
  },
  files: { image: { folder: 'portfolio', required: true } },
  list: () => q.listPhotos(),
  get: q.getPhoto,
};

export const heroResource = {
  table: heroSlides,
  schema: {
    caption: S.str({ max: 200, default: '' }),
    order: S.int({ default: 0, min: -100000, max: 100000 }),
    is_active: S.bool({ default: true }),
  },
  files: { image: { folder: 'hero', required: true } },
  list: () => q.listHeroSlides({ activeOnly: false }),
  get: q.getHeroSlide,
};

export const galleryResource = {
  table: gallerySpots,
  schema: {
    title: S.str({ max: 200, default: '' }),
    span: S.oneOf(['normal', 'tall', 'wide'], { default: 'normal' }),
    order: S.int({ default: 0, min: -100000, max: 100000 }),
    is_active: S.bool({ default: true }),
  },
  files: { image: { folder: 'gallery', required: true } },
  list: () => q.listGallerySpots({ activeOnly: false }),
  get: q.getGallerySpot,
};

export const testimonialResource = {
  table: testimonials,
  schema: {
    client_name: S.str({ max: 100, required: true }),
    event_type: S.str({ max: 100, required: true }),
    message: S.str({ max: 5000, required: true }),
    rating: S.int({ min: 1, max: 5, default: 5 }),
    is_featured: S.bool({ default: false }),
  },
  files: { photo: { folder: 'testimonials' } },
  list: () => q.listTestimonials(),
  get: q.getTestimonial,
};

export const serviceResource = {
  table: services,
  schema: {
    name: S.str({ max: 200, required: true }),
    slug: S.str({ max: 120, default: '' }),
    description: S.str({ max: 5000, required: true }),
    price_from: S.money({ required: true }),
    duration: S.str({ max: 100, required: true }),
    includes: S.str({ max: 5000, default: '' }),
    icon: S.str({ max: 50, default: 'camera' }),
    is_active: S.bool({ default: true }),
  },
  files: { cover_image: { folder: 'services' } },
  list: () => q.listServices({ activeOnly: false }),
  get: q.getService,
  prepare: (data, ctx) => ensureSlug(services, data, ctx),
};

export const bookingResource = {
  table: bookings,
  // Admins can only triage bookings; clients create them via the public form.
  schema: {
    status: S.oneOf(BOOKING_STATUSES),
    notes: S.str({ max: 5000, default: '' }),
    quoted_price: S.money({ nullable: true }),
  },
  list: () => q.listBookings(),
  get: q.getBooking,
  allow: ['list', 'update', 'delete'],
};
