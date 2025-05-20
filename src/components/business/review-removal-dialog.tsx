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
import { AlertTriangle } from "lucide-react";

interface ReviewRemovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  businessName: string;
  businessEmail: string;
}

export function ReviewRemovalDialog({
  isOpen,
  onClose,
  review,
  businessName,
  businessEmail,
}: ReviewRemovalDialogProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews/remove-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review._id,
          reason,
          businessName,
          businessEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit removal request");
      }

      setIsSubmitted(true);
      toast({
        title: "בקשה נשלחה בהצלחה",
        description: "בקשתך להסרת הביקורת נשלחה לצוות שלנו ותיבחן בהקדם.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לשלוח את הבקשה. אנא נסה שוב.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setReason("");
    setIsSubmitted(false);
  };

  // When dialog closes, reset state
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Use setTimeout to reset state after dialog animation completes
      setTimeout(resetState, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>בקשה להסרת ביקורת</DialogTitle>
          <DialogDescription>
            {isSubmitted
              ? "בקשתך נשלחה לצוות התמיכה שלנו ותיבחן בהקדם."
              : "הסרת ביקורות נעשית במקרים חריגים שאינם עומדים בקווים המנחים של הקהילה."}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="space-y-4 py-4">
            <h3 className="font-semibold text-lg">תודה על פנייתך</h3>
            <p className="text-muted-foreground">
              צוות הבדיקה שלנו יבחן את בקשתך ויצור עמך קשר בהקדם האפשרי.
            </p>
            <p className="text-muted-foreground">
              אנו מתחייבים לבחון כל מקרה בקפידה, אולם שים לב שאנו בדרך כלל לא
              מסירים ביקורות רק משום שהן שליליות.
            </p>
            <DialogFooter>
              <Button onClick={handleClose}>סגור</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-1">
                  חשוב לדעת
                </h4>
                <p className="text-xs text-amber-700">
                  אנו בדרך כלל לא מסירים ביקורות רק משום שהן שליליות. פורום
                  הביקורות שלנו מוקדש לשקיפות וכנות. במקום זאת, אנו ממליצים
                  להגיב לביקורות שליליות בצורה מקצועית.
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
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

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                סיבה לבקשת הסרה
              </label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="אנא פרט את הסיבה שבגללה ביקורת זו מפרה את תנאי השימוש שלנו..."
                className="min-h-[150px]"
                required
              />
              <p className="text-xs text-muted-foreground">
                עליך לציין סיבה ספציפית להסרה כגון: תוכן פוגעני, מידע שקרי, או
                הפרה של תנאי השימוש שלנו.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                ביטול
              </Button>
              <Button type="submit" disabled={isSubmitting || !reason.trim()}>
                {isSubmitting ? "שולח..." : "שלח בקשת הסרה"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
