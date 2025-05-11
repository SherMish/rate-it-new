"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WriteReviewButtonProps {
  url: string;
}

export default function WriteReviewButton({ url }: WriteReviewButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await router.push(`/tool/${encodeURIComponent(url)}/review`);
  };

  return (
    <Button 
      className="gradient-button px-4 h-[40px]"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Write Review"}
    </Button>
  );
} 