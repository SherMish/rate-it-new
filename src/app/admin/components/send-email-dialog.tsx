"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  isWebsiteOwner: boolean;
  isVerifiedWebsiteOwner: boolean;
  reviewCount: number;
  relatedWebsite: string | null;
  createdAt: string;
  workRole: string | null;
  workEmail: string | null;
  isAgreeMarketing: boolean;
}

interface SendEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}

export function SendEmailDialog({
  open,
  onOpenChange,
  user,
}: SendEmailDialogProps) {
  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    message: "",
    ctaText: "",
    ctaUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      subject: "",
      title: "",
      message: "",
      ctaText: "",
      ctaUrl: "",
    });
    setEmailSent(false);
    setFormError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async () => {
    if (
      !user?.email ||
      !formData.subject ||
      !formData.title ||
      !formData.message
    ) {
      setFormError("אנא מלאו את כל השדות הנדרשים");
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: formData.subject,
          title: formData.title,
          message: formData.message,
          ctaText: formData.ctaText || undefined,
          ctaUrl: formData.ctaUrl || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || "שליחת האימייל נכשלה");
        return;
      }

      setEmailSent(true);
      toast.success("האימייל נשלח בהצלחה!");

      // Auto close after 2 seconds
      setTimeout(() => {
        handleOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      setFormError("שליחת האימייל נכשלה. אנא נסו שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h3 className="text-lg font-semibold text-center">
              האימייל נשלח בהצלחה!
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              האימייל נשלח אל {user?.email}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">
            שליחת אימייל אל {user?.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-right">
            {user?.email}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-right block">נושא האימייל *</Label>
            <Input
              placeholder="נושא האימייל"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-right block">כותרת ההודעה *</Label>
            <Input
              placeholder="כותרת ההודעה"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-right block">תוכן ההודעה *</Label>
            <Textarea
              placeholder="כתבו את תוכן ההודעה כאן..."
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              className="text-right min-h-[120px]"
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">טקסט כפתור (אופציונלי)</Label>
              <Input
                placeholder="לחצו כאן"
                value={formData.ctaText}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ctaText: e.target.value }))
                }
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">
                קישור כפתור (אופציונלי)
              </Label>
              <Input
                placeholder="https://example.com"
                value={formData.ctaUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ctaUrl: e.target.value }))
                }
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              ביטול
            </Button>
            <Button
              onClick={handleSubmit}
              className="gradient-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  שולח...
                </>
              ) : (
                "שלח אימייל"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
