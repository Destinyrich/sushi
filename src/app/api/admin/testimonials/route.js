import { collectionRoute } from '@/lib/crud';
import { testimonialResource } from '@/lib/resources';

const route = collectionRoute(testimonialResource);
export const GET = route.GET;
export const POST = route.POST;
