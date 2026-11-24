import BookingForm from '@/components/BookingForm';
import { listServices } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Book a Session' };

export default async function BookingPage() {
  const services = await listServices();
  return <BookingForm services={services} />;
}
