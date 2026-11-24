import { redirect } from 'next/navigation';
import AdminLogin from '@/components/admin/AdminLogin';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Login', robots: { index: false } };

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');
  return <AdminLogin />;
}
