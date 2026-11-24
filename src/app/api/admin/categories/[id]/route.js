import { itemRoute } from '@/lib/crud';
import { categoryResource } from '@/lib/resources';

const route = itemRoute(categoryResource);
export const GET = route.GET;
export const PATCH = route.PATCH;
export const DELETE = route.DELETE;
