import { itemRoute } from '@/lib/crud';
import { galleryResource } from '@/lib/resources';

const route = itemRoute(galleryResource);
export const GET = route.GET;
export const PATCH = route.PATCH;
export const DELETE = route.DELETE;
