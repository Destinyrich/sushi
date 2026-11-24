import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return <AdminShell username={session.username}>{children}</AdminShell>;
}
