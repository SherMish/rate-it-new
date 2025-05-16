"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Star, Upload, Eye, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import categoriesData from "@/lib/data/categories.json";
import { useLoginModal } from "@/hooks/use-login-modal";
import { CldUploadButton } from "next-cloudinary";
import { useToast } from "@/components/ui/use-toast";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

interface ReviewData {
  url?: string;
  name?: string;
  rating: number;
  title: string;
  content: string;
  proof?: string;
  toolName: string;
  toolURL: string;
  relatedCategory: string;
}

interface ReviewFormProps {
  isNewTool?: boolean;
  initialUrl?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["jpg", "png", "pdf"];

const CHAR_LIMITS = {
  title: 100,
};

const STORAGE_KEY_REVIEW = "pending_review_data";
const STORAGE_KEY_TOOL = "pending_tool_data";

export default function ReviewForm({
  isNewTool = false,
  initialUrl = "",
}: ReviewFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const loginModal = useLoginModal();
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [reviewData, setReviewData] = useState<ReviewData>({
    url: initialUrl,
    name: "",
    rating: 0,
    title: "",
    content: "",
    proof: undefined,
    toolName: "",
    toolURL: "",
    relatedCategory: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved form data on mount
  useEffect(() => {
    const storageKey = isNewTool ? STORAGE_KEY_TOOL : STORAGE_KEY_REVIEW;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setReviewData((prev) => ({
          ...prev,
          ...parsedData,
          url: initialUrl || parsedData.url, // Keep initialUrl if provided
        }));
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, [isNewTool, initialUrl]);

  // Save form data when fields change
  const handleFieldChange = (field: keyof ReviewData, value: any) => {
    const updatedData = { ...reviewData, [field]: value };
    setReviewData(updatedData);

    // Save to localStorage
    const storageKey = isNewTool ? STORAGE_KEY_TOOL : STORAGE_KEY_REVIEW;
    localStorage.setItem(storageKey, JSON.stringify(updatedData));
  };

  // Clear saved data after successful submission
  const clearSavedData = () => {
    const storageKey = isNewTool ? STORAGE_KEY_TOOL : STORAGE_KEY_REVIEW;
    localStorage.removeItem(storageKey);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const errors: { [key: string]: string } = {};

    const validFiles = files.filter((file) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        errors.files =
          "Invalid file type. Please upload JPG, PNG, or PDF files only.";
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.files = "File size exceeds 5MB limit.";
        return false;
      }
      return true;
    });

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setReviewData((prev) => ({
        ...prev,
        proof: validFiles[0]?.name,
      }));
    }
  };

  const removeFile = (index: number) => {
    setReviewData((prev) => ({
      ...prev,
      proof: undefined,
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (isNewTool) {
      if (!reviewData.toolURL?.trim()) {
        errors.url = "נא להזין את כתובת האתר של העסק";
      }
      if (!reviewData.toolName?.trim()) {
        errors.name = "נא להזין את שם העסק";
      }
      if (!reviewData.relatedCategory) {
        errors.category = "נא לבחור קטגוריה";
      }
    }
    if (reviewData.rating === 0) {
      errors.rating = "נא לבחור דירוג";
    }
    if (!reviewData.title.trim()) {
      errors.title = "נא להזין כותרת לביקורת";
    } else if (reviewData.title.length > CHAR_LIMITS.title) {
      errors.title = `כותרת חייבת להיות עד ${CHAR_LIMITS.title} תווים`;
    }
    if (reviewData.content.length < 10) {
      errors.content = "הביקורת חייבת להכיל לפחות 10 תווים";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePreviewSubmit = () => {
    if (!validateForm()) return;

    // Check for authentication first
    if (!session?.user) {
      loginModal.onOpen();
      return;
    }

    // If authenticated, show preview
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!session?.user) {
      loginModal.onOpen();
      return;
    }

    try {
      setIsSubmitting(true);

      if (isNewTool) {
        // First create the website
        const websiteResponse = await fetch("/api/websites/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: reviewData.toolName,
            url: reviewData.toolURL,
            relatedCategory: reviewData.relatedCategory,
            description: "", // Optional description can be added later
          }),
        });

        if (!websiteResponse.ok) {
          if (websiteResponse.status === 401) {
            signIn(undefined, {
              callbackUrl: window.location.href,
            });
            return;
          }
          throw new Error("Failed to create website");
        }

        const website = await websiteResponse.json();

        // Then create the review
        const reviewResponse = await fetch("/api/reviews/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: reviewData.title,
            body: reviewData.content,
            rating: reviewData.rating,
            relatedWebsite: website._id,
            proof: reviewData.proof,
          }),
        });

        if (!reviewResponse.ok) {
          throw new Error("Failed to create review");
        }

        // Track successful review creation
        trackEvent(AnalyticsEvents.REVIEW_CREATED, {
          toolId: website._id,
          toolName: reviewData.toolName,
          rating: reviewData.rating,
          hasScreenshot: !!reviewData.proof,
          reviewLength: reviewData.content.length,
        });

        // Clear saved data only after successful submission
        clearSavedData();
        setShowSuccessDialog(true);

        setTimeout(() => {
          router.push(`/tool/${encodeURIComponent(reviewData.toolURL)}`);
        }, 5000);
      } else {
        // Existing tool review flow
        const websiteResponse = await fetch(
          `/api/websites/find?url=${encodeURIComponent(initialUrl)}`
        );
        if (!websiteResponse.ok) {
          throw new Error("Failed to find website");
        }
        const website = await websiteResponse.json();

        const reviewResponse = await fetch("/api/reviews/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: reviewData.title,
            body: reviewData.content,
            rating: reviewData.rating,
            relatedWebsite: website._id,
            proof: reviewData.proof,
          }),
        });

        if (!reviewResponse.ok) {
          throw new Error("Failed to create review");
        }

        // Track successful review creation
        trackEvent(AnalyticsEvents.REVIEW_CREATED, {
          toolId: website._id,
          toolName: reviewData.toolName,
          rating: reviewData.rating,
          hasScreenshot: !!reviewData.proof,
          reviewLength: reviewData.content.length,
        });

        // Clear saved data only after successful submission
        clearSavedData();
        setShowSuccessDialog(true);

        setTimeout(() => {
          router.push(`/tool/${encodeURIComponent(initialUrl)}`);
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: "Failed to submit. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (result: any) => {
    if (result.info) {
      setReviewData((prev) => ({
        ...prev,
        proof: result.info.secure_url,
      }));
      toast({
        title: "File uploaded successfully",
        description: "Your proof has been attached to the review",
      });
    }
  };

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            className={`w-6 h-6 ${
              index <= reviewData.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-zinc-300"
            }`}
          />
        ))}
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">{reviewData.title}</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {reviewData.content}
        </p>
      </div>

      {reviewData.proof && (
        <div>
          <h4 className="font-medium mb-2">הוכחה מצורפת</h4>
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground">
              {reviewData.proof}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="bg-white border-border shadow-sm">
      <div className="p-6">
        <div className="space-y-6">
          {/* URL Input for new tools */}
          {isNewTool && (
            <>
              <div className="space-y-2">
                <Label htmlFor="toolURL">כתובת אתר העסק</Label>
                <Input
                  id="toolURL"
                  name="toolURL"
                  type="url"
                  required
                  value={reviewData.toolURL}
                  onChange={(e) => handleFieldChange("toolURL", e.target.value)}
                  onBlur={(e) => handleFieldChange("toolURL", e.target.value)}
                  placeholder="https://example.com"
                  className="bg-background"
                />
                {formErrors.url && (
                  <p className="text-sm text-destructive">{formErrors.url}</p>
                )}
              </div>

              {/* Add Tool Name field */}
              <div className="space-y-2">
                <Label htmlFor="toolName">שם העסק</Label>
                <Input
                  id="toolName"
                  name="toolName"
                  required
                  value={reviewData.toolName}
                  onChange={(e) =>
                    handleFieldChange("toolName", e.target.value)
                  }
                  onBlur={(e) => handleFieldChange("toolName", e.target.value)}
                  placeholder="הזן את שם העסק"
                  className="bg-background"
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">קטגוריה</Label>
                <Select
                  name="category"
                  required
                  onValueChange={(value) =>
                    handleFieldChange("relatedCategory", value)
                  }
                >
                  <SelectTrigger
                    className={formErrors.category ? "border-destructive" : ""}
                  >
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
                {formErrors.category && (
                  <p className="text-sm text-destructive">
                    {formErrors.category}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">דירוג</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoveredRating(index)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleFieldChange("rating", index)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      index <= (hoveredRating || reviewData.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-zinc-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {formErrors.rating && (
              <p className="text-sm text-destructive">{formErrors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">כותרת הביקורת</label>
            <Input
              value={reviewData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              onBlur={(e) => handleFieldChange("title", e.target.value)}
              placeholder="סכם את החוויה שלך"
              className={`bg-background ${
                formErrors.title ? "border-red-500" : ""
              }`}
              maxLength={CHAR_LIMITS.title}
            />
            <p className="text-sm text-muted-foreground">
              {reviewData.title.length} / {CHAR_LIMITS.title}
            </p>
            {formErrors.title && (
              <p className="text-sm text-destructive">{formErrors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">הביקורת שלך</label>
            <Textarea
              value={reviewData.content}
              onChange={(e) => handleFieldChange("content", e.target.value)}
              onBlur={(e) => handleFieldChange("content", e.target.value)}
              placeholder="שתף את החוויה שלך עם העסק..."
              className="h-32 bg-background"
            />
            {formErrors.content && (
              <p className="text-sm text-destructive">{formErrors.content}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {reviewData.content.length}/1000
            </p>
          </div>

          {/* Proof Upload */}
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  אימות החוויה שלך (אופציונלי)
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  הוספת הוכחה עוזרת לאמת את הביקורת שלך. זה יכול להיות: <br />
                  • קבלה/חשבונית רכישה <br />
                  • צילום מסך של השימוש <br />
                  ההוכחה לא תהיה גלויה למשתמשים אחרים, אך עשויה להיות משותפת עם
                  בעל העסק לצורך אימות. שים לב שביקורות ללא הוכחה עשויות להיות
                  כפופות להסרה אם בעל העסק יבקש זאת.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUpload}
                options={{
                  maxFiles: 1,
                  maxFileSize: MAX_FILE_SIZE,
                  resourceType: "auto",
                  clientAllowedFormats: ALLOWED_FILE_TYPES,
                  sources: ["local", "url", "camera"],
                }}
              >
                <Button variant="outline">
                  <Upload className="w-4 h-4 ml-2" />
                  העלאת הוכחה
                </Button>
              </CldUploadButton>

              <div className="text-xs text-muted-foreground/75">
                <p className="mb-1">דרישות קובץ:</p>
                <ul className="space-y-0.5">
                  <li>גודל קובץ מקסימלי: 5MB</li>
                  <li>פורמטים מותרים: JPG, PNG, PDF</li>
                  <li>קובץ אחד לביקורת</li>
                </ul>
              </div>

              {reviewData.proof && (
                <p className="text-sm text-green-500">הקובץ הועלה בהצלחה</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              className="gradient-button  w-[50%]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  שולח...
                </>
              ) : (
                "שלח ביקורת"
              )}
            </Button>
          </div>

          {formErrors.submit && (
            <p className="text-sm text-destructive text-center mt-2">
              {formErrors.submit}
            </p>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>תצוגה מקדימה של הביקורת</AlertDialogTitle>
            <AlertDialogDescription>
              כך תיראה הביקורת שלך לאחרים.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">{renderPreview()}</div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              ערוך ביקורת
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  שולח...
                </>
              ) : (
                "שלח ביקורת"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>תודה על הביקורת שלך! 🎉</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>הביקורת שלך הוגשה בהצלחה ✅</p>
              <p>
                ייתכן שייקח מספר רגעים עד שהיא תופיע באתר בזמן שאנו מעבדים אותה
                ⏳
              </p>
              <p className="text-muted-foreground">מפנה אותך לדף העסק...</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
