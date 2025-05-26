"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ReviewLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function ReviewLayout({ children, title }: ReviewLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background relative" dir="rtl">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => {
              if (window.history.length > 2) {
                router.back();
              } else {
                router.push('/');
              }
            }}

          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה
          </Button>

          <h1 className="text-2xl font-bold mb-6">{title}</h1>

          {children}
        </div>
      </div>
    </div>
  );
}
