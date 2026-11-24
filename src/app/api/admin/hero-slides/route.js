import { collectionRoute } from '@/lib/crud';
import { heroResource } from '@/lib/resources';

const route = collectionRoute(heroResource);
export const GET = route.GET;
export const POST = route.POST;
