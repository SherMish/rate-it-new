"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserPlan {
  currentPlan: "basic" | "plus" | "pro";
  licenseValidDate?: string;
  isVerified: boolean;
}

export function usePlanManagement() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch user's current plan if they're authenticated
  useEffect(() => {
    if (session?.user?.isWebsiteOwner) {
      fetchUserPlan();
    }
  }, [session]);

  const fetchUserPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/business/current-plan");
      if (response.ok) {
        const data = await response.json();
        setUserPlan(data);
      }
    } catch (error) {
      console.error("Failed to fetch user plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const upgradeToPlusClick = (billing: "monthly" | "annual" = "monthly") => {
    upgradeToClick("plus", billing);
  };

  const upgradeToProClick = (billing: "monthly" | "annual" = "monthly") => {
    upgradeToClick("pro", billing);
  };

  const upgradeToClick = (plan: "plus" | "pro", billing: "monthly" | "annual" = "monthly") => {
    // If user is not logged in, redirect to registration
    if (!session?.user) {
      router.push("/business/register");
      return;
    }

    // If user is not a website owner, redirect to registration
    if (!session.user.isWebsiteOwner) {
      router.push("/business/register");
      return;
    }

    // If user is already on the requested plan, do nothing
    if (userPlan?.currentPlan === plan) {
      return;
    }

    // If user has a registered business on basic plan, go to payment page
    if (userPlan?.currentPlan === "basic") {
      router.push(`/business/upgrade/plus?plan=${plan}&billing=${billing}`);
      return;
    }

    // Default fallback
    router.push("/business/register");
  };

  const isCurrentPlan = (plan: "basic" | "plus" | "pro") => {
    return userPlan?.currentPlan === plan;
  };

  const canUpgradeToPlus = () => {
    return (
      session?.user?.isWebsiteOwner &&
      userPlan?.currentPlan === "basic"
    );
  };

  const isPlusOrHigher = () => {
    return userPlan?.currentPlan === "plus" || userPlan?.currentPlan === "pro";
  };

  return {
    userPlan,
    loading,
    upgradeToPlusClick,
    upgradeToProClick,
    isCurrentPlan,
    canUpgradeToPlus,
    isPlusOrHigher,
    refreshPlan: fetchUserPlan,
  };
}
