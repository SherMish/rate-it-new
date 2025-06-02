"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/contexts/loading-context";

interface WriteReviewButtonProps {
  url: string;
  buttonText?: string;
}

export default function WriteReviewButton({
  url,
  buttonText = "כתוב ביקורת",
}: WriteReviewButtonProps) {
  const router = useRouter();
  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startLoading();

    // Add a small delay to show the progress bar
    await new Promise((resolve) => setTimeout(resolve, 100));

    router.push(`/tool/${encodeURIComponent(url)}/review`);

    // Stop loading after a delay (the page will change anyway)
    setTimeout(() => {
      stopLoading();
    }, 1500);
  };

  return (
    <Button
      className="gradient-button px-4 h-[40px]"
      disabled={isLoading}
      onClick={handleClick}
    >
      {buttonText}
    </Button>
  );
}
