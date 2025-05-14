"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().min(1, "אימייל נדרש").email("כתובת אימייל לא תקינה"),
  password: z.string().min(6, "סיסמה חייבת להיות לפחות 6 תווים"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "שם חייב להיות לפחות 2 תווים"),
    email: z.string().min(1, "אימייל נדרש").email("כתובת אימייל לא תקינה"),
    password: z.string().min(6, "סיסמה חייבת להיות לפחות 6 תווים"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "עליך להסכים לתנאי השימוש",
    }),
    agreeToMarketing: z.boolean(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "הסיסמאות אינן תואמות",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function LoginModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState<string | null>(null);

  const loginModal = useLoginModal();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      agreeToMarketing: true,
    },
  });

  /* ---------- helpers ---------- */

  const handleGoogleLogin = () =>
    signIn("google", { callbackUrl: window.location.href, redirect: true });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (res?.error) setAuthError("אימייל או סיסמה שגויים");
      else {
        loginModal.onClose();
        toast({ title: "הצלחה", description: "התחברת בהצלחה" });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: e instanceof Error ? e.message : "משהו השתבש",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);

      const exists = await fetch(
        `/api/auth/check-email?email=${encodeURIComponent(data.email)}`
      ).then((r) => r.json());

      if (exists?.exists) {
        registerForm.setError("email", {
          type: "manual",
          message: "אימייל זה כבר רשום במערכת",
        });
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          isAgreeMarketing: data.agreeToMarketing,
        }),
      });

      if (!res.ok) throw new Error((await res.json()).error || "ההרשמה נכשלה");

      // auto‑login
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      loginModal.onClose();
      toast({ title: "הצלחה", description: "ההרשמה וההתחברות הצליחו" });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: e instanceof Error ? e.message : "משהו השתבש",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- JSX ---------- */

  return (
    <Dialog open={loginModal.isOpen} onOpenChange={loginModal.onClose}>
      <DialogContent
        className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border border-border/40"
        dir="rtl" /* RTL container */
      >
        <DialogHeader className="space-y-3 ">
          <DialogTitle className="text-2xl font-bold">ברוכים הבאים</DialogTitle>
          <DialogDescription className="text-base text-right">
            {" "}
            {/* 🆕 */}
            הירשמו בחינם כדי לשתף את החוויה שלכם ולדרג עסקים
          </DialogDescription>
        </DialogHeader>

        {/* -------- Tabs -------- */}
        <Tabs
          dir="rtl"
          defaultValue="login"
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "login" | "register")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">התחברות</TabsTrigger>
            <TabsTrigger value="register">הרשמה</TabsTrigger>
          </TabsList>

          {/* ---- LOGIN ---- */}
          <TabsContent value="login" className="space-y-4 mt-4 text-right">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <Input
                  {...loginForm.register("email")}
                  placeholder="אימייל"
                  type="email"
                  dir="rtl"
                />
                <Input
                  {...loginForm.register("password")}
                  placeholder="סיסמה"
                  type="password"
                  dir="rtl"
                />

                {authError && (
                  <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-center">
                    <p className="text-sm font-medium text-red-600">
                      {authError}
                    </p>
                  </div>
                )}

                <div className="flex justify-start">
                  <Button
                    variant="link"
                    className="text-sm px-0"
                    type="button"
                    onClick={() => {
                      loginModal.onClose();
                      window.location.href = "/forgot-password";
                    }}
                  >
                    שכחת את הסיסמה?
                  </Button>
                </div>

                <Button disabled={isLoading} className="w-full" type="submit">
                  התחברות
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* ---- REGISTER ---- */}
          <TabsContent value="register" className="space-y-4 mt-4 text-right">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                {/* name / email / pass */}
                <Input
                  {...registerForm.register("name")}
                  placeholder="שם"
                  disabled={isLoading}
                  dir="rtl"
                />
                <FormMessage>
                  {registerForm.formState.errors.name?.message}
                </FormMessage>

                <Input
                  {...registerForm.register("email")}
                  placeholder="אימייל"
                  type="email"
                  disabled={isLoading}
                  dir="rtl"
                />
                <FormMessage>
                  {registerForm.formState.errors.email?.message}
                </FormMessage>

                <Input
                  {...registerForm.register("password")}
                  placeholder="סיסמה"
                  type="password"
                  disabled={isLoading}
                  dir="rtl"
                />
                <FormMessage>
                  {registerForm.formState.errors.password?.message}
                </FormMessage>

                <Input
                  {...registerForm.register("confirmPassword")}
                  placeholder="אימות סיסמה"
                  type="password"
                  disabled={isLoading}
                  dir="rtl"
                />
                <FormMessage>
                  {registerForm.formState.errors.confirmPassword?.message}
                </FormMessage>

                {/* terms / marketing */}
                <FormField
                  control={registerForm.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex row items-end gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-snug">
                        אני מסכים/ה ל
                        <Link
                          href="/terms"
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          תנאי השימוש
                        </Link>{" "}
                        ול
                        <Link
                          href="/privacy"
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          מדיניות הפרטיות
                        </Link>
                      </FormLabel>
                      {/* <FormMessage /> //TODO: appears in row instead of col */} 
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="agreeToMarketing"
                  render={({ field }) => (
                    <FormItem className="flex items-end gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-snug">
                        אני מסכים/ה לקבל עדכונים על עסקים חדשים מדי פעם
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !registerForm.formState.isValid}
                >
                  {isLoading ? "נרשם..." : "הרשמה"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {/* ----- Divider + Google ----- */}
        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center items-end text-xs uppercase">
            <span className="px-2 text-muted-foreground">או המשך עם</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full flex items-center justify-center bg-background hover:bg-secondary/80 border-border/50 gap-2"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle className="w-5 h-5 ms-4" />
          גוגל
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-2">
          בהמשך, אתה מסכים לתנאי השימוש ומדיניות הפרטיות שלנו
        </p>
      </DialogContent>
    </Dialog>
  );
}
