"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import categoriesData from "@/lib/data/categories.json";
import { ImageUpload } from "@/components/image-upload";
import { Switch } from "@/components/ui/switch";
import { WebsiteType, PricingModel } from "@/lib/types/website";
import { Wand2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const CHAR_LIMITS = {
  name: 50,
  shortDescription: 100,
  description: 1000,
};

interface FormData {
  name: string;
  url: string;
  category: string;
  description: string;
  shortDescription: string;
  logo: string | undefined;
  pricingModel: string;
  launchYear: number | null;
}

interface FormErrors {
  name?: string;
  shortDescription?: string;
  description?: string;
}

export default function ToolPage() {
  const { isLoading, website } = useBusinessGuard();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "",
    category: "",
    description: "",
    shortDescription: "",
    logo: undefined,
    pricingModel: "",
    launchYear: null,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [alertError, setAlertError] = useState<string | null>(null);
  const [hasAppliedCurrentData, setHasAppliedCurrentData] = useState(false);

  useEffect(() => {
    if (website && !hasAppliedCurrentData) {
      setFormData({
        name: website.name,
        url: website.url,
        category: website.category || "",
        description: website.description || "",
        shortDescription: website.shortDescription || "",
        logo: website.logo || undefined,
        pricingModel: website.pricingModel || "",
        launchYear: website.launchYear || null,
      });
      setHasAppliedCurrentData(true);
    }
  }, [website]);

  const handleSave = async () => {
    try {
      // Validate fields
      const newErrors: FormErrors = {};

      if (!formData.name.trim()) {
        newErrors.name = "נדרש שם עסק";
      }
      if (!formData.shortDescription.trim()) {
        newErrors.shortDescription = "נדרש תיאור קצר";
      }
      if (!formData.description.trim()) {
        newErrors.description = "נדרש תיאור";
      }

      setFormErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        toast.error("אנא מלאו את כל השדות הנדרשים");
        return;
      }

      setIsSaving(true);
      const response = await fetch(`/api/admin/websites/${website?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "עדכון נכשל");
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000); // Hide after 10 seconds
      setFormErrors({});
    } catch (error) {
      console.error("Error updating website:", error);
      toast.error(
        error instanceof Error ? error.message : "עדכון העסק נכשל. אנא נסו שוב."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium">לוגו</label>
              <ImageUpload
                value={formData.logo || ""}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, logo: url }))
                }
                onRemove={() => setFormData((prev) => ({ ...prev, logo: "" }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="grid gap-2 md:col-span-1">
                <label className="text-sm font-medium">שם העסק</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="הזן את שם העסק"
                  maxLength={CHAR_LIMITS.name}
                  className={`${formErrors.name ? "border-red-500" : ""}`}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.name.length} / {CHAR_LIMITS.name}
                </p>
              </div>

              <div className="grid gap-2 md:col-span-3">
                <label className="text-sm font-medium">תיאור קצר</label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  placeholder="תיאור קצר של העסק שלך"
                  maxLength={CHAR_LIMITS.shortDescription}
                  className={`${
                    formErrors.shortDescription ? "border-red-500" : ""
                  }`}
                />
                {formErrors.shortDescription && (
                  <p className="text-sm text-red-500">
                    {formErrors.shortDescription}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.shortDescription.length} /{" "}
                  {CHAR_LIMITS.shortDescription}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-medium">כתובת URL</label>
                <Input
                  disabled={true}
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="הזן את כתובת האתר"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">קטגוריה</label>
                <Select
                  dir="rtl"
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">תיאור</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="תיאור מפורט של העסק שלך"
                className={`w-full h-32 rounded-md border px-3 py-2 text-sm ${
                  formErrors.description ? "border-red-500" : ""
                }`}
                maxLength={CHAR_LIMITS.description}
              />
              {formErrors.description && (
                <p className="text-sm text-red-500">{formErrors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.description.length} / {CHAR_LIMITS.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-medium">מודל מחירים</label>
                <Select
                  value={formData.pricingModel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, pricingModel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מודל מחירים" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PricingModel).map((model) => (
                      <SelectItem key={model} value={model}>
                        {model.charAt(0).toUpperCase() +
                          model.slice(1).replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">שנת השקה</label>
                <Input
                  type="number"
                  value={formData.launchYear?.toString() || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      launchYear: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    }))
                  }
                  min={2000}
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {showSuccess && (
                <p className="text-sm text-green-500">
                  ✅ פרטי העסק שלך עודכנו בהצלחה!
                </p>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gradient-button"
                >
                  {isSaving ? "שומר..." : "שמור שינויים"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
