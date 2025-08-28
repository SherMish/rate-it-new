import { WebVitalsDashboard } from "@/components/analytics/web-vitals-dashboard";

export default function WebVitalsPage() {
  return (
    <div className="container mx-auto py-6">
      <WebVitalsDashboard />
    </div>
  );
}

export const metadata = {
  title: "Web Vitals Dashboard",
  description: "Monitor your website's Core Web Vitals performance metrics",
};
