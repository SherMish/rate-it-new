"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/loading-context";

export function ClaimToolButton({ websiteUrl }: { websiteUrl: string }) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleClaim = async () => {
    startLoading();

    localStorage.setItem(
      "businessRegistration",
      JSON.stringify({ websiteUrl })
    );

    // Add a small delay to show the progress bar
    await new Promise((resolve) => setTimeout(resolve, 100));

    router.push("/business/register");

    // Stop loading after a delay (the page will change anyway)
    setTimeout(() => {
      stopLoading();
    }, 1500);
  };

  return (
    <Button
      onClick={handleClaim}
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground mr-0 ml-0 px-[2px]"
    >
      <span className="border-b border-dotted border-foreground/30 hover:border-primary">
        לאימות בעלות על העסק לחצו כאן
      </span>
    </Button>
  );
}
