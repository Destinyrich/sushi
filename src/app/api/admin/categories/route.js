import { collectionRoute } from '@/lib/crud';
import { categoryResource } from '@/lib/resources';

const route = collectionRoute(categoryResource);
export const GET = route.GET;
export const POST = route.POST;
