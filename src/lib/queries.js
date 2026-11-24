// All database reads, returning plain JSON-safe objects with the same
// snake_case field names the original Django REST API used.
import { and, asc, count, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  bookings, categories, gallerySpots, heroSlides, photos, services, testimonials, BOOKING_STATUSES,
} from '@/db/schema';
import { mediaUrl } from './media';

const iso = (d) => (d instanceof Date ? d.toISOString() : d ?? null);

// ── Serializers ──────────────────────────────────────────────────────────────
const photo = (r) => ({ ...r, image: mediaUrl(r.image), created_at: iso(r.created_at) });
const slide = (r) => ({ ...r, image: mediaUrl(r.image), created_at: iso(r.created_at) });
const spot = (r) => ({ ...r, image: mediaUrl(r.image) });
const testimonial = (r) => ({ ...r, photo: mediaUrl(r.photo), created_at: iso(r.created_at) });
const service = (r) => ({ ...r, cover_image: mediaUrl(r.cover_image) });
const booking = (r) => ({
  ...r,
  created_at: iso(r.created_at),
  updated_at: iso(r.updated_at),
});

// ── Categories ───────────────────────────────────────────────────────────────
export async function listCategories() {
  return db
    .select({
      id: categories.id, name: categories.name, slug: categories.slug,
      description: categories.description, photo_count: count(photos.id),
    })
    .from(categories)
    .leftJoin(photos, eq(photos.category_id, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.id));
}

export async function getCategory(id) {
  return (await listCategories()).find((c) => c.id === id) ?? null;
}

// ── Photos ───────────────────────────────────────────────────────────────────
const photoSelect = {
  id: photos.id, title: photos.title, category: photos.category_id,
  category_name: categories.name, category_slug: categories.slug,
  image: photos.image, description: photos.description, featured: photos.featured,
  order: photos.order, created_at: photos.created_at,
};

export async function listPhotos({ category, featured } = {}) {
  const where = [];
  if (category) where.push(eq(categories.slug, category));
  if (featured) where.push(eq(photos.featured, true));
  const rows = await db
    .select(photoSelect).from(photos)
    .innerJoin(categories, eq(photos.category_id, categories.id))
    .where(where.length ? and(...where) : undefined)
    .orderBy(asc(photos.order), desc(photos.created_at));
  return rows.map(photo);
}

export async function getPhoto(id) {
  const [row] = await db.select(photoSelect).from(photos)
    .innerJoin(categories, eq(photos.category_id, categories.id))
    .where(eq(photos.id, id));
  return row ? photo(row) : null;
}

// ── Hero slides / gallery spots ──────────────────────────────────────────────
export async function listHeroSlides({ activeOnly = true } = {}) {
  const rows = await db.select().from(heroSlides)
    .where(activeOnly ? eq(heroSlides.is_active, true) : undefined)
    .orderBy(asc(heroSlides.order), asc(heroSlides.created_at));
  return rows.map(slide);
}
export async function getHeroSlide(id) {
  const [row] = await db.select().from(heroSlides).where(eq(heroSlides.id, id));
  return row ? slide(row) : null;
}

export async function listGallerySpots({ activeOnly = true } = {}) {
  const rows = await db.select().from(gallerySpots)
    .where(activeOnly ? eq(gallerySpots.is_active, true) : undefined)
    .orderBy(asc(gallerySpots.order), asc(gallerySpots.id));
  return rows.map(spot);
}
export async function getGallerySpot(id) {
  const [row] = await db.select().from(gallerySpots).where(eq(gallerySpots.id, id));
  return row ? spot(row) : null;
}

// ── Testimonials ─────────────────────────────────────────────────────────────
export async function listTestimonials({ featured } = {}) {
  const rows = await db.select().from(testimonials)
    .where(featured ? eq(testimonials.is_featured, true) : undefined)
    .orderBy(asc(testimonials.id));
  return rows.map(testimonial);
}
export async function getTestimonial(id) {
  const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id));
  return row ? testimonial(row) : null;
}

// ── Services ─────────────────────────────────────────────────────────────────
export async function listServices({ activeOnly = true } = {}) {
  const rows = await db.select().from(services)
    .where(activeOnly ? eq(services.is_active, true) : undefined)
    .orderBy(asc(services.id));
  return rows.map(service);
}
export async function getService(id) {
  const [row] = await db.select().from(services).where(eq(services.id, id));
  return row ? service(row) : null;
}

// ── Bookings ─────────────────────────────────────────────────────────────────
const bookingSelect = { ...bookings, service: bookings.service_id, service_name: services.name };

export async function listBookings({ limit } = {}) {
  const q = db.select(bookingSelect).from(bookings)
    .leftJoin(services, eq(bookings.service_id, services.id))
    .orderBy(desc(bookings.created_at), desc(bookings.id));
  return (limit ? await q.limit(limit) : await q).map(booking);
}

export async function getBooking(id) {
  const [row] = await db.select(bookingSelect).from(bookings)
    .leftJoin(services, eq(bookings.service_id, services.id))
    .where(eq(bookings.id, id));
  return row ? booking(row) : null;
}

export async function getBookingStats() {
  const rows = await db.select({ status: bookings.status, n: count() }).from(bookings).groupBy(bookings.status);
  const by_status = Object.fromEntries(BOOKING_STATUSES.map((s) => [s, 0]));
  let total = 0;
  for (const { status, n } of rows) { by_status[status] = n; total += n; }
  return { total, by_status };
}
