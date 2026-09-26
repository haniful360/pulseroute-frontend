import { redirect } from 'next/navigation';
import { getCurrentUserAction } from '@/services/auth.service';

export default async function DashboardPage() {
  const userRes = await getCurrentUserAction();

  if (!userRes.success || !userRes.data?.user) {
    redirect('/login');
  }

  const role = userRes.data.user.role;

  if (role === 'DRIVER') {
    redirect('/dashboard/driver');
  } else if (role === 'SUPER_ADMIN') {
    redirect('/dashboard/super-admin');
  } else {
    redirect('/dashboard/patient');
  }
}
