import { redirect } from 'next/navigation';
import { AdminDashboard } from './components/admin-dashboard';

export default async function AdminPage() {
  // Protect the page in production
  if (process.env.IS_PRODUCTION === 'true') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage AI tools and their metadata
          </p>
        </div>

        <AdminDashboard />
      </div>
    </div>
  );
} 