"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Review } from "./reviews-section";

interface ReportReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  userEmail: string;
}

export function ReportReviewModal({
  isOpen,
  onClose,
  review,
  userEmail,
}: ReportReviewModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      setMessage("");
      if (!userEmail) {
        setEmail("");
      }
    }
  }, [isOpen, userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review._id,
          reviewTitle: review.title,
          reviewBody: review.body,
          reviewAuthor: review.relatedUser?.name || "אנונימי",
          reporterEmail: email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("שליחת הדיווח נכשלה");
      }

      setIsSubmitted(true);
      toast({
        title: "הדיווח נשלח",
        description: "תודה שעזרת לנו לשמור על איכות הפלטפורמה.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "שליחת הדיווח נכשלה. נסה שוב.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>דיווח על ביקורת</DialogTitle>
          <DialogDescription>
            עזרו לנו לשמור על איכות הפלטפורמה על ידי דיווח על תוכן פוגעני או
            מטעה.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="space-y-4 py-4">
            <h3 className="font-semibold text-lg">תודה על הדיווח</h3>
            <p className="text-muted-foreground">
              אנו מעריכים את הזמן שהקדשת לדווח על הביקורת. הצוות שלנו יבחן את
              הדיווח בקפידה.
            </p>
            <p className="text-muted-foreground">
              אם נזדקק למידע נוסף, ניצור איתך קשר בכתובת {email}.
            </p>
            <DialogFooter>
              <Button onClick={onClose}>סגור</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                כתובת אימייל
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="הכנס/י כתובת אימייל"
                required
                disabled={!!userEmail}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                הודעה (אופציונלי)
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ספר/י לנו מדוע את/ה מדווח/ת על הביקורת"
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                ביטול
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "שולח..." : "שלח דיווח"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
