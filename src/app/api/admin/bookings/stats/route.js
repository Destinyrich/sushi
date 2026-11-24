import { withAdmin } from '@/lib/auth';
import { json } from '@/lib/validate';
import { getBookingStats } from '@/lib/queries';

export const GET = withAdmin(async () => json(await getBookingStats()));
