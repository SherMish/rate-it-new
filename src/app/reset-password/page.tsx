"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "הסיסמאות אינן תואמות",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "קישור לאיפוס סיסמה אינו תקף",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      toast({
        title: "הסיסמה אופסה בהצלחה",
        description: "הסיסמה שלך אופסה. ניתן להתחבר עם הסיסמה החדשה.",
      });

      window.location.href = "/";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "איפוס הסיסמה נכשל. נסה שוב.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        dir="rtl"
        className="container flex items-center justify-center min-h-[calc(100vh-4rem)]"
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>קישור איפוס לא תקין</CardTitle>
            <CardDescription>
              קישור האיפוס הזה לא תקף או שפג תוקפו.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="container flex items-center justify-center min-h-[calc(100vh-4rem)]"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>איפוס סיסמה</CardTitle>
          <CardDescription>אנא הזינו סיסמה חדשה למטה.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="סיסמה חדשה"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="אימות סיסמה"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "מאפס..." : "אפס סיסמה"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
