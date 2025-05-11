import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center w-full h-full min-h-[100px]">
      <Loader2 className={`h-8 w-8 animate-spin ${className}`} />
    </div>
  );
} 