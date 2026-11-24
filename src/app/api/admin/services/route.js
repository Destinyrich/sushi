import { collectionRoute } from '@/lib/crud';
import { serviceResource } from '@/lib/resources';

const route = collectionRoute(serviceResource);
export const GET = route.GET;
export const POST = route.POST;
