import { collectionRoute } from '@/lib/crud';
import { bookingResource } from '@/lib/resources';

const route = collectionRoute(bookingResource);
export const GET = route.GET;
