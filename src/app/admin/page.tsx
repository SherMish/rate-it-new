import { redirect } from "next/navigation";
import { AdminDashboard } from "./components/admin-dashboard";

export default async function AdminPage() {
  return (
    <div className="min-h-screen bg-background relative" dir="rtl">
      {/* Background effects - match main page */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f620,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

      <div className="relative container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-right">
          <h1 className="text-3xl font-bold mb-2">לוח בקרה למנהלים</h1>
          <p className="text-muted-foreground">
            ניהול עסקים, ביקורות ופוסטים בבלוג
          </p>
        </div>

        <AdminDashboard />
      </div>
    </div>
  );
}
