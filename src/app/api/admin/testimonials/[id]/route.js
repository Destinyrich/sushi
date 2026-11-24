import { itemRoute } from '@/lib/crud';
import { testimonialResource } from '@/lib/resources';

const route = itemRoute(testimonialResource);
export const GET = route.GET;
export const PATCH = route.PATCH;
export const DELETE = route.DELETE;
