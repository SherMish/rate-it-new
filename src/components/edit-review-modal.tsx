"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import RatingTiles from "@/components/ui/rating-tiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Review {
  _id: string;
  title: string;
  body: string;
  rating: number;
}

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  onSuccess: () => void;
}

const CHAR_LIMITS = {
  title: 100,
};

export function EditReviewModal({
  isOpen,
  onClose,
  review,
  onSuccess,
}: EditReviewModalProps) {
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: review.rating,
    title: review.title,
    body: review.body,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field changes
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (formData.rating === 0) {
      errors.rating = "נא לבחור דירוג";
    }
    if (!formData.title.trim()) {
      errors.title = "נא להזין כותרת לביקורת";
    } else if (formData.title.length > CHAR_LIMITS.title) {
      errors.title = `כותרת חייבת להיות עד ${CHAR_LIMITS.title} תווים`;
    }
    if (formData.body.length < 10) {
      errors.body = "הביקורת חייבת להכיל לפחות 10 תווים";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/reviews/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review._id,
          title: formData.title,
          body: formData.body,
          rating: formData.rating,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update review");
      }

      toast({
        title: "הביקורת עודכנה בהצלחה",
        description: "השינויים נשמרו",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "שגיאה בעדכון הביקורת",
        description: error instanceof Error ? error.message : "אנא נסה שוב",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form to original values when closing
    setFormData({
      rating: review.rating,
      title: review.title,
      body: review.body,
    });
    setFormErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>עריכת ביקורת</DialogTitle>
          <DialogDescription>
            עדכן את הביקורת שלך כאן
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">דירוג</label>
            <div className="flex gap-2">
              <RatingTiles
                value={formData.rating}
                hoverValue={hoveredRating}
                onHover={(v) => setHoveredRating(v)}
                onChange={(v) => handleFieldChange("rating", v)}
                size={32}
                starFontSize={22}
                gap={3}
                emptyColor="#e5e7eb"
                tileRadius={6}
                useDynamicColor
              />
            </div>
            {formErrors.rating && (
              <p className="text-sm text-destructive">{formErrors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">כותרת הביקורת</label>
            <Input
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="סכם את החוויה שלך"
              className={`bg-background ${
                formErrors.title ? "border-red-500" : ""
              }`}
              maxLength={CHAR_LIMITS.title}
            />
            <p className="text-sm text-muted-foreground">
              {formData.title.length} / {CHAR_LIMITS.title}
            </p>
            {formErrors.title && (
              <p className="text-sm text-destructive">{formErrors.title}</p>
            )}
          </div>

          {/* Body */}
          <div className="space-y-2">
            <label className="text-sm font-medium">הביקורת שלך</label>
            <Textarea
              value={formData.body}
              onChange={(e) => handleFieldChange("body", e.target.value)}
              placeholder="שתף את החוויה שלך עם העסק..."
              className="h-32 bg-background"
            />
            {formErrors.body && (
              <p className="text-sm text-destructive">{formErrors.body}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {formData.body.length}/1000
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ביטול
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                שומר...
              </>
            ) : (
              "שמור שינויים"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
