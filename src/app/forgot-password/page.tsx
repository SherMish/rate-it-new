"use client";

import { useState } from "react";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("אנא הזינו כתובת אימייל תקינה"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || "שליחת המייל נכשלה");
      }

      setEmailSent(true);
      toast({
        title: "המייל נשלח",
        description: "בדקו את תיבת הדואר לקבלת הוראות לאיפוס הסיסמה.",
      });
    } catch (error) {
      console.error("שגיאת איפוס סיסמה:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description:
          error instanceof Error
            ? error.message
            : "שליחת מייל האיפוס נכשלה. נסו שוב.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="container flex items-center justify-center min-h-[calc(100vh-4rem)]"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>איפוס סיסמה</CardTitle>
          <CardDescription>
            הזינו את כתובת האימייל שלכם ונשלח אליכם הוראות לאיפוס הסיסמה.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                שלחנו אליכם מייל עם הוראות לאיפוס הסיסמה. בדקו את תיבת הדואר
                שלכם.
              </p>
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full"
              >
                שלחו שוב
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="הזינו את כתובת האימייל שלכם"
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "שולח..." : "שלח הוראות לאיפוס"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
