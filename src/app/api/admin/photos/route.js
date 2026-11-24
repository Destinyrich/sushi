import { collectionRoute } from '@/lib/crud';
import { photoResource } from '@/lib/resources';

const route = collectionRoute(photoResource);
export const GET = route.GET;
export const POST = route.POST;
