import { collectionRoute } from '@/lib/crud';
import { galleryResource } from '@/lib/resources';

const route = collectionRoute(galleryResource);
export const GET = route.GET;
export const POST = route.POST;
