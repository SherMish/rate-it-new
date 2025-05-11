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

export function ReportReviewModal({ isOpen, onClose, review, userEmail }: ReportReviewModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Set email when userEmail prop changes or modal opens
  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  // Reset state when modal closes
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
          reviewAuthor: review.relatedUser?.name || "Anonymous",
          reporterEmail: email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      setIsSubmitted(true);
      toast({
        title: "Report Submitted",
        description: "Thank you for helping us maintain the quality of our platform.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Review</DialogTitle>
          <DialogDescription>
            Help us maintain the quality of our platform by reporting inappropriate or misleading content.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="space-y-4 py-4">
            <h3 className="font-semibold text-lg">Thank You for Your Report</h3>
            <p className="text-muted-foreground">
              We appreciate you taking the time to help maintain the quality of our platform. Our team will review your report carefully.
            </p>
            <p className="text-muted-foreground">
              If we need additional information, we will contact you at {email}.
            </p>
            <DialogFooter>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Your Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={!!userEmail}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message (Optional)
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us why you're reporting this review"
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 