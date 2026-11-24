import { itemRoute } from '@/lib/crud';
import { serviceResource } from '@/lib/resources';

const route = itemRoute(serviceResource);
export const GET = route.GET;
export const PATCH = route.PATCH;
export const DELETE = route.DELETE;
