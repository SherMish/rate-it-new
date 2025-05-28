"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
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

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
  user: UserType | null;
}

export function EditUserDialog({
  open,
  onOpenChange,
  onUserUpdated,
  user,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    isWebsiteOwner: false,
    isVerifiedWebsiteOwner: false,
    relatedWebsite: "",
    workRole: "",
    workEmail: "",
    isAgreeMarketing: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form when dialog opens with new user
  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        isWebsiteOwner: user.isWebsiteOwner,
        isVerifiedWebsiteOwner: user.isVerifiedWebsiteOwner,
        relatedWebsite: user.relatedWebsite || "",
        workRole: user.workRole || "",
        workEmail: user.workEmail || "",
        isAgreeMarketing: user.isAgreeMarketing || false,
      });
    }
  }, [user, open]);

  const handleSubmit = async () => {
    if (!user?._id) return;

    setIsLoading(true);
    setFormError(null);

    try {
      const response = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || "עדכון המשתמש נכשל");
        return;
      }

      toast.success("המשתמש עודכן בהצלחה");
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setFormError("עדכון המשתמש נכשל. אנא נסו שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">
            עריכת משתמש: {user?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {formError && (
            <p className="text-sm text-red-500 mb-4 text-right">
              ❌ {formError}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">שם</Label>
              <Input
                placeholder="שם המשתמש"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">אימייל</Label>
              <Input
                placeholder="אימייל"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="text-right"
                dir="rtl"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">סוג משתמש</Label>
              <Select
                dir="rtl"
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר תפקיד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">משתמש</SelectItem>
                  <SelectItem value="business_owner">בעל עסק</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right block">עסק משויך</Label>
              <Input
                placeholder="כתובת העסק המשויך"
                value={formData.relatedWebsite}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    relatedWebsite: e.target.value,
                  }))
                }
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Work Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">תפקיד בעבודה</Label>
              <Input
                placeholder="תפקיד בעבודה"
                value={formData.workRole}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workRole: e.target.value,
                  }))
                }
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">אימייל עבודה</Label>
              <Input
                placeholder="אימייל עבודה"
                value={formData.workEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workEmail: e.target.value,
                  }))
                }
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={formData.isWebsiteOwner}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isWebsiteOwner: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <Label className="text-right">בעל עסק</Label>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={formData.isVerifiedWebsiteOwner}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVerifiedWebsiteOwner: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <Label className="text-right">בעל עסק מאומת</Label>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={formData.isAgreeMarketing}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAgreeMarketing: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <Label className="text-right">מסכים לקבל עדכונים</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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
                  שומר שינויים...
                </>
              ) : (
                "שמור שינויים"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
