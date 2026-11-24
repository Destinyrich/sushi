import { itemRoute } from '@/lib/crud';
import { bookingResource } from '@/lib/resources';

const route = itemRoute(bookingResource);
export const GET = route.GET;
export const PATCH = route.PATCH;
export const DELETE = route.DELETE;
