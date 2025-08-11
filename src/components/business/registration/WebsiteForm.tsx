"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { checkWebsiteExists } from "@/app/actions/website";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { WebsiteType } from "@/lib/models/Website";
import { useSession } from "next-auth/react";
import {
  sanitizeUrl,
  isValidUrl,
  getUrlErrorMessage,
} from "@/lib/utils/url-validation";

const formSchema = z.object({
  websiteUrl: z
    .string()
    .min(1, "כתובת האתר נדרשת")
    .refine(
      (val) => isValidUrl(val),
      (val) => ({
        message: getUrlErrorMessage(val),
      })
    )
    .transform((val) => sanitizeUrl(val)),
  businessName: z.string().min(2, "שם העסק חייב להכיל לפחות 2 תווים"),
  fullName: z.string().min(2, "השם המלא חייב להכיל לפחות 2 תווים"),
  phoneNumber: z.string().min(10, "אנא הזינו מספר טלפון תקין"),
  role: z.string().min(2, "אנא ציינו את התפקיד שלכם"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "יש להסכים לתנאי השימוש",
  }),
});

interface FormData {
  websiteUrl: string;
  businessName: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  agreedToTerms: boolean;
  email?: string;
}

interface WebsiteFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onComplete: () => void;
}

export function WebsiteRegistrationForm({
  formData,
  setFormData,
  onComplete,
}: WebsiteFormProps) {
  const [loading, setLoading] = useState(false);
  const [existingWebsite, setExistingWebsite] = useState<WebsiteType | null>(
    null
  );
  const { data: sessionData } = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
    mode: "onBlur",
  });

  useEffect(() => {
    const checkWebsite = async () => {
      const url = form.getValues("websiteUrl");
      if (!url || !isValidUrl(url)) return;

      const sanitizedUrl = sanitizeUrl(url);

      setLoading(true);
      try {
        const website = await checkWebsiteExists(sanitizedUrl);
        setExistingWebsite(website);
        if (website?.name) {
          form.setValue("businessName", website.name);
        }
      } catch (error) {
        console.error("Error checking website:", error);
      }
      setLoading(false);
    };

    checkWebsite();
  }, [formData.websiteUrl]);

  const handleUrlBlur = async () => {
    const url = form.getValues("websiteUrl");
    if (!url) return;

    // Validate the URL first
    if (!isValidUrl(url)) {
      form.setError("websiteUrl", {
        message: getUrlErrorMessage(url),
      });
      return;
    }

    // Sanitize the URL and update the field
    const sanitizedUrl = sanitizeUrl(url);
    form.setValue("websiteUrl", sanitizedUrl);

    // Check if there are any validation errors
    if (form.formState.errors.websiteUrl) return;

    setLoading(true);
    try {
      const website = await checkWebsiteExists(sanitizedUrl);
      setExistingWebsite(website);
      if (website?.name) {
        form.setValue("businessName", website.name);
      }
    } catch (error) {
      form.setError("websiteUrl", { message: "שגיאה בבדיקת האתר" });
    }
    setLoading(false);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // The websiteUrl should already be sanitized by the schema transform
      const sanitizedUrl = data.websiteUrl;

      const existingWebsite = await checkWebsiteExists(sanitizedUrl);

      if (existingWebsite?.isVerified) {
        form.setError("websiteUrl", {
          message: "אתר זה כבר אומת. אנא צרו קשר עם מנהל האתר כדי לבקש גישה.",
        });
        return;
      }

      // Save form data to localStorage with sanitized URL
      const formData = {
        ...data,
        websiteUrl: sanitizedUrl,
        step: 3,
        email: data.email,
      };
      localStorage.setItem("businessRegistration", JSON.stringify(formData));

      await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          phone: data.phoneNumber,
          workRole: data.role,
        }),
      });
      
      setFormData({ ...data, websiteUrl: sanitizedUrl });
      onComplete();
    } catch (error) {
      console.error("Error in form submission:", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("businessRegistration");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset(parsed);
    }
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        dir="rtl"
      >
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>כתובת האתר</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="example.com"
                    onBlur={() => {
                      field.onBlur();
                      handleUrlBlur();
                    }}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
                {existingWebsite && !existingWebsite.isVerified && (
                  <Alert className="bg-muted/50 border-muted text-muted-foreground text-sm">
                    <AlertDescription className="flex items-center gap-1">
                      <span className="opacity-75">הערה:</span> אתר זה כבר קיים
                      במערכת שלנו.{" "}
                      <Link
                        href={`/tool/${existingWebsite.url}`}
                        className="text-primary/75 hover:text-primary hover:underline inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        צפייה בדף האתר <ExternalLink className="h-3 w-3" />
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם העסק</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="שם החברה שלך" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם מלא</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="השם המלא שלך" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מספר טלפון</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0540000000" type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>התפקיד שלך</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="לדוגמה: מנכ״ל, מנהל שיווק" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreedToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-0 space-y-0 rtl:space-x-reverse gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    אני מסכים/ה ל
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      תנאי השימוש
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || Object.keys(form.formState.errors).length > 0}
          >
            {loading ? "בודק..." : "המשך"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
