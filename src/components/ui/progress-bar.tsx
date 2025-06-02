import { useEffect, useState } from "react";

interface ProgressBarProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function ProgressBar({ isLoading, onComplete }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // Stop at 90% until completion
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      // Complete the progress
      setProgress(100);

      // Hide after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
        onComplete?.();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 h-1">
      {/* Background track */}
      <div className="absolute inset-0 bg-gray-300/60" />

      {/* Progress bar */}
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
