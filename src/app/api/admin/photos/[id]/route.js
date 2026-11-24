import { itemRoute } from '@/lib/crud';
import { photoResource } from '@/lib/resources';

const route = itemRoute(photoResource);
export const GET = route.GET;
export const PATCH = route.PATCH;
export const DELETE = route.DELETE;
