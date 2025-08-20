"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star, Zap, Crown, Gift, ArrowRight } from "lucide-react";
import { proFeatures } from "@/components/business/shared-pricing-table";
import { CelebrationModal } from "@/components/modals/celebration-modal";

// This is a redirect component that forwards to the plus upgrade page with pro parameters
export default function ProUpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Redirect to the unified upgrade page with pro plan parameter
    const billing = searchParams?.get("billing") || "monthly";
    router.replace(`/business/upgrade/plus?plan=pro&billing=${billing}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
        <p className="text-slate-600">מעביר לדף התשלום...</p>
      </div>
    </div>
  );
}
