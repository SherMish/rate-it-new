import { Metadata } from "next";
import { SideNav } from "./side-nav";

export const metadata: Metadata = {
  title: "לוח הבקרה | Rate It",
  description: "נהלו את דף העסק שלכם, קבלו ביקורות וצפו בנתונים וסטטיסטיקות",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <SideNav />
        <main className="flex-1 relative p-8">
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />
          <div className="relative min-h-screen pb-16">{children}</div>
        </main>
      </div>
    </div>
  );
}
