import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { bookings, services } from '@/db/schema';
import { ApiError, S, handle, json, parse, readBody } from '@/lib/validate';

// Public: anyone can submit a booking request.
const schema = {
  client_name: S.str({ max: 200, required: true }),
  client_email: S.email({ required: true }),
  client_phone: S.str({ max: 30, required: true }),
  service: S.fk({ as: 'service_id', nullable: true }),
  event_type: S.str({ max: 200, required: true }),
  event_date: S.date({ required: true }),
  event_time: S.time({ nullable: true }),
  event_location: S.str({ max: 300, required: true }),
  guest_count: S.int({ min: 1, max: 100000, default: 1 }),
  special_requests: S.str({ max: 5000, default: '' }),
};

export const POST = handle(async (req) => {
  const { fields } = await readBody(req);

  // Honeypot: real visitors never fill this hidden field. Pretend success to bots.
  if (fields.website) return json({ id: null, status: 'pending' }, 201);

  const data = parse(fields, schema);

  if (data.service_id) {
    const [svc] = await db.select({ id: services.id }).from(services)
      .where(and(eq(services.id, data.service_id), eq(services.is_active, true)));
    if (!svc) throw new ApiError(400, 'service: Selected service is not available.', { service: 'Selected service is not available.' });
  }

  const [row] = await db.insert(bookings).values(data)
    .returning({ id: bookings.id, status: bookings.status, created_at: bookings.created_at });
  return json(row, 201);
});
