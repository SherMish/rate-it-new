"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Crown } from "lucide-react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
}

export function CelebrationModal({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "המשך",
}: CelebrationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-primary/20 animate-in zoom-in-95 duration-300">
        {/* Celebration Animation */}
        <div className="absolute -top-4 -right-4">
          <div className="relative">
            <div className="animate-pulse">
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-4 -left-4">
          <div className="animate-pulse delay-200">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center border-4 border-green-200 animate-bounce">
            <div className="relative">
              <CheckCircle className="h-10 w-10 text-green-600" />
              <Crown className="h-4 w-4 text-primary absolute -top-1 -right-1" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{description}</p>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            size="lg"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
