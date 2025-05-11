"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function ClaimToolButton({ websiteUrl }: { websiteUrl: string }) {
  const router = useRouter();

  const handleClaim = () => {
    localStorage.setItem(
      "businessRegistration",
      JSON.stringify({ websiteUrl })
    );
    router.push("/business/register");
  };

  return (
    <Button 
      onClick={handleClaim}
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground mr-0 ml-0 px-[2px]"
    >
      Claim Ownership
    </Button>
  );
} 