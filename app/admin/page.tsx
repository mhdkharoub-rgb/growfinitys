import { requireAdmin } from '@/lib/auth';
import AdminPanel from '@/components/AdminPanel';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireAdmin();
  if (!user) return <div>Not authorized.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <AdminPanel />
    </div>
  );
}
