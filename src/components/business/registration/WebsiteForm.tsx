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

const formSchema = z.object({
  websiteUrl: z
    .string()
    .min(1, "Website URL is required")
    .transform((val) => {
      if (!val.startsWith("http://") && !val.startsWith("https://")) {
        return `https://${val}`;
      }
      return val;
    })
    .pipe(z.string().url("Please enter a valid URL")),
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  role: z.string().min(2, "Please specify your role"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
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
      if (!url) return;

      setLoading(true);
      try {
        const website = await checkWebsiteExists(url);
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
    if (!url || form.formState.errors.websiteUrl) return;

    setLoading(true);
    try {
      const website = await checkWebsiteExists(url);
      setExistingWebsite(website);
      if (website?.name) {
        form.setValue("businessName", website.name);
      }
    } catch (error) {
      form.setError("websiteUrl", { message: "Error checking website" });
    }
    setLoading(false);
  };

  const onSubmit = async (data: FormData) => {
    const existingWebsite = await checkWebsiteExists(data.websiteUrl);

    if (existingWebsite?.isVerified) {
      form.setError("websiteUrl", {
        message:
          "This website has already been verified. Please contact the website admin to request access.",
      });
      return;
    }

    // Save form data to localStorage
    const formData = {
      ...data,
      step: 3,
      email: data.email, // Use email directly from form data
    };
    console.log("Saving form data to localStorage:", formData);
    localStorage.setItem("businessRegistration", JSON.stringify(formData));

    setFormData(data);
    onComplete();
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com"
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
                      <span className="opacity-75">Note:</span> This tool is
                      already in our database.{" "}
                      <Link
                        href={`/tool/${existingWebsite.url}`}
                        className="text-primary/75 hover:text-primary hover:underline inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View tool&apos;s page{" "}
                        <ExternalLink className="h-3 w-3" />
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
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your company name" />
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
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your full name" />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                    />
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
                <FormLabel>Your Role</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. CEO, Marketing Manager" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreedToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Terms of Service
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
            {loading ? "Checking..." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
