"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useLoading } from "@/contexts/loading-context";

interface WriteFirstReviewButtonProps {
  toolUrl: string;
}

export function WriteFirstReviewButton({
  toolUrl,
}: WriteFirstReviewButtonProps) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleClick = async () => {
    startLoading();

    // Add a small delay to show the progress bar
    await new Promise((resolve) => setTimeout(resolve, 100));

    router.push(`/tool/${toolUrl}/review`);

    // Stop loading after a delay (the page will change anyway)
    setTimeout(() => {
      stopLoading();
    }, 1500);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors"
    >
      <ArrowRight className="w-4 h-4 mr-1 order-last" />
      כתוב את הביקורת הראשונה
    </button>
  );
}
