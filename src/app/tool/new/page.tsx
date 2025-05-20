"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLoginModal } from "@/hooks/use-login-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import categoriesJson from "@/lib/data/categories.json";
import { UploadImage } from "@/components/upload-image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// Get the categories array from the JSON structure
const categories = categoriesJson.categories;

// Add these constants at the top of the file
const CHAR_LIMITS = {
  url: 50,
  name: 50,
  shortDescription: 100,
  description: 1000,
};

interface FormErrors {
  url?: string;
  name?: string;
  category?: string;
  shortDescription?: string;
  description?: string;
  logo?: string;
}

const STORAGE_KEY = "pending_tool_data";

export default function NewTool() {
  const router = useRouter();
  const { data: session } = useSession();
  const loginModal = useLoginModal();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (error) {
          console.error("Error parsing saved form data:", error);
        }
      }
    }
    return {
      url: "",
      name: "",
      category: "",
      description: "",
      shortDescription: "",
      logo: undefined,
    };
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Save form data when fields change
  const handleFieldChange = (
    field: keyof typeof formData,
    value: string | undefined
  ) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  };

  // Store form data in state when login modal is opened
  const [pendingSubmission, setPendingSubmission] = useState<
    null | typeof formData
  >(null);

  // Effect to handle post-authentication submission
  const submitForm = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!session?.user) {
        loginModal.onOpen();
        return;
      }

      if (!validateForm()) {
        return;
      }

      try {
        setIsLoading(true);

        const response = await fetch("/api/tools", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: formData.url.trim(),
            name: formData.name.trim(),
            category: formData.category,
            description: formData.description.trim(),
            shortDescription: formData.shortDescription.trim(),
            logo: formData.logo,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle duplicate URL error
          if (data.error === "This website has already been added") {
            setErrors((prev) => ({
              ...prev,
              url: "אתר זה כבר נמצא במערכת. אנא בחר כתובת אחרת.",
            }));
            return;
          }
          throw new Error(data.error || "הוספת האתר נכשלה");
        }

        if (!data.url) {
          throw new Error("לא התקבלה כתובת חזרה מהשרת");
        }

        toast({
          title: "הצלחה",
          description: "האתר נוסף בהצלחה",
        });

        console.log("before delete local storage");
        // Clear saved data after successful submission
        localStorage.removeItem(STORAGE_KEY);
        router.push(`/tool/${encodeURIComponent(data.url)}`);
      } catch (error) {
        console.error("Website creation error:", error);

        // Only show toast for non-validation errors
        if (!errors.url) {
          toast({
            variant: "destructive",
            title: "שגיאה",
            description:
              error instanceof Error ? error.message : "הוספת האתר נכשלה",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [session, formData, errors, loginModal, toast, router]
  );

  useEffect(() => {
    if (session && pendingSubmission) {
      const form = document.querySelector("form");
      if (form) {
        form.requestSubmit();
      }
      setPendingSubmission(null);
    }
  }, [session, pendingSubmission]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // URL validation
    if (!formData.url) {
      newErrors.url = "יש להזין כתובת אתר";
    } else {
      // URL pattern that matches most URLs without being too strict
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
      if (!urlPattern.test(formData.url)) {
        newErrors.url = "אנא הזן כתובת אתר תקינה";
      }
      if (formData.url.length > CHAR_LIMITS.url) {
        newErrors.url = `כתובת האתר חייבת להיות פחות מ-${CHAR_LIMITS.url} תווים`;
      }
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = "יש להזין שם";
    } else if (formData.name.length < 3) {
      newErrors.name = "השם חייב להיות לפחות 3 תווים";
    } else if (formData.name.length > CHAR_LIMITS.name) {
      newErrors.name = `השם חייב להיות פחות מ-${CHAR_LIMITS.name} תווים`;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "אנא בחר קטגוריה";
    }

    // Short description validation
    if (formData.shortDescription) {
      const wordCount = formData.shortDescription.trim().split(/\s+/).length;
      if (wordCount > 10) {
        newErrors.shortDescription = "התיאור הקצר חייב להיות 10 מילים או פחות";
      }
      if (formData.shortDescription.length > CHAR_LIMITS.shortDescription) {
        newErrors.shortDescription = `התיאור הקצר חייב להיות פחות מ-${CHAR_LIMITS.shortDescription} תווים`;
      }
    }

    // Description validation
    if (formData.description) {
      if (formData.description.length > CHAR_LIMITS.description) {
        newErrors.description = `התיאור חייב להיות פחות מ-${CHAR_LIMITS.description} תווים`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="relative min-h-screen bg-background" dir="rtl">
      {/* Background effects - match main page */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f620,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

      <div className="relative container max-w-4xl mx-auto sm:px-4 py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4 ml-1" />
            חזרה לעמוד הראשי
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-white shadow-sm">
          <div className="p-6 border-b border-border">
            <h1 className="text-3xl font-bold text-foreground">
              הוספת עסק חדש
            </h1>
            <p className="text-muted-foreground">
              הוסיפו עסק בקלות על מנת לשתף ביקורת עם הקהילה
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={submitForm} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="url" className="text-sm font-medium">
                    כתובת האתר של העסק, החברה או השירות
                  </label>
                  <Input
                    id="url"
                    type="text"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => handleFieldChange("url", e.target.value)}
                    onBlur={(e) => handleFieldChange("url", e.target.value)}
                    className={`w-full ${errors.url ? "border-red-500" : ""}`}
                    maxLength={CHAR_LIMITS.url}
                    dir="ltr"
                  />
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      יש להזין כתובת תקינה
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formData.url.length} / {CHAR_LIMITS.url}
                    </p>
                  </div>
                  {errors.url && (
                    <p className="text-sm text-red-500">{errors.url}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    שם העסק
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="הקלידו את שם העסק"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onBlur={(e) => handleFieldChange("name", e.target.value)}
                    className={`w-full ${errors.name ? "border-red-500" : ""}`}
                    maxLength={CHAR_LIMITS.name}
                  />
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      לפחות 3 תווים
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formData.name.length} / {CHAR_LIMITS.name}
                    </p>
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    קטגוריה
                  </label>
                  <Select
                    dir="rtl"
                    value={formData.category}
                    onValueChange={(value) =>
                      handleFieldChange("category", value)
                    }
                  >
                    <SelectTrigger
                      className={`w-full text-right ${
                        errors.category ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="בחרו קטגוריה" />
                    </SelectTrigger>
                    <SelectContent className="text-right" dir="rtl">
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="text-right"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 space-x-reverse">
                <Button
                  type="submit"
                  className="gradient-button"
                  disabled={isLoading}
                >
                  {isLoading ? "מוסיף..." : "הוסף עסק"}
                </Button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                בעל עסק? הירשם{" "}
                <Link
                  href="/business/register"
                  className="text-primary hover:underline"
                >
                  כאן בחינם{" "}
                </Link>
                וקבל שליטה על העמוד העסקי שלך
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
