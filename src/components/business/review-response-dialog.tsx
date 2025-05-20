"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Review } from "@/components/reviews-section";

interface ReviewResponseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  onResponseSubmitted: () => void;
}

export function ReviewResponseDialog({
  isOpen,
  onClose,
  review,
  onResponseSubmitted,
}: ReviewResponseDialogProps) {
  const [responseText, setResponseText] = useState(
    review.businessResponse?.text || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review._id,
          responseText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit response");
      }

      toast({
        title: "תגובה נשלחה בהצלחה",
        description: "תגובתך לביקורת פורסמה בהצלחה.",
      });

      onResponseSubmitted();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לשלוח את התגובה. אנא נסה שוב.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>תגובה לביקורת</DialogTitle>
          <DialogDescription>
            תגובתך תוצג באופן ציבורי תחת הביקורת. השתמש בהזדמנות זו להתייחס
            לנקודות שהועלו בביקורת באופן מקצועי.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="p-4 bg-muted rounded-lg mb-4">
              <div className="text-sm font-medium mb-2">
                ביקורת מאת: {review.relatedUser?.name || "אנונימי"}
              </div>
              <div className="text-sm mb-2">
                <strong>דירוג:</strong> {review.rating}/5
              </div>
              <div className="text-sm mb-2">
                <strong>כותרת:</strong> {review.title}
              </div>
              <div className="text-sm">
                <strong>תוכן:</strong> {review.body}
              </div>
            </div>

            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="כתוב את תגובתך לביקורת..."
              className="min-h-[150px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              הימנע משפה פוגענית ומידע אישי. תגובות מקצועיות ואדיבות בונות אמון
              עם לקוחות פוטנציאליים.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !responseText.trim()}
            >
              {isSubmitting
                ? "שולח..."
                : review.businessResponse
                ? "עדכן תגובה"
                : "פרסם תגובה"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
