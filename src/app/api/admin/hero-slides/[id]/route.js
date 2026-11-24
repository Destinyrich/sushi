import { itemRoute } from '@/lib/crud';
import { heroResource } from '@/lib/resources';

const route = itemRoute(heroResource);
export const GET = route.GET;
export const PATCH = route.PATCH;
export const DELETE = route.DELETE;
