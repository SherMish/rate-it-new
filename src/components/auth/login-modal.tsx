"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useLoginModal } from '@/hooks/use-login-modal';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';


const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
  agreeToMarketing: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function LoginModal() {
  const [isLoading, setIsLoading] = useState(false);
  const loginModal = useLoginModal();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      agreeToMarketing: true,
    },
    mode: "onChange",
  });

  const handleGoogleLogin = () => {
    signIn('google', { 
      callbackUrl: window.location.href,
      redirect: true
    });
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError("Invalid email or password");
      } else if (result?.ok) {
        loginModal.onClose();
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      // Add this console.log to verify the data being sent
      console.log('Registration data being sent:', {
        name: data.name,
        email: data.email,
        password: data.password,
        isAgreeMarketing: data.agreeToMarketing
      });

      // Check if email exists before trying to register
      const checkEmailRes = await fetch(`/api/auth/check-email?email=${encodeURIComponent(data.email)}`);
      const checkEmailData = await checkEmailRes.json();
      
      if (checkEmailData.exists) {
        registerForm.setError('email', {
          type: 'manual',
          message: 'This email is already registered'
        });
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          isAgreeMarketing: data.agreeToMarketing,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to register");
      }

      // After successful registration, sign in
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: window.location.href,
      });

      if (result?.error) {
        loginModal.onClose();
        toast({
          title: "Success",
          description: "Registration successful. Please log in.",
        });
        return;
      }

      loginModal.onClose();
      toast({
        title: "Success",
        description: "Registration and login successful",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={loginModal.isOpen} onOpenChange={loginModal.onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border border-border/40">
        <DialogHeader className="space-y-3 text-center">
          <DialogTitle className="text-2xl font-bold">Welcome</DialogTitle>
          <DialogDescription className="text-base">
            Sign in to share your experience and review AI tools
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    {...loginForm.register('email')}
                    type="email"
                    placeholder="Email"
                  />
                  <Input
                    {...loginForm.register('password')}
                    type="password"
                    placeholder="Password"
                  />
                </div>
                {authError && (
                  <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
                    <div className="flex items-center justify-center">
                      <p className="text-sm font-medium text-red-600">
                        {authError}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex justify-start">
                  <Button
                    variant="link"
                    className="px-0 text-sm"
                    type="button"
                    onClick={() => {
                      loginModal.onClose();
                      window.location.href = '/forgot-password';
                    }}
                  >
                    Forgot your password?
                  </Button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Login
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-4">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Input
                      {...registerForm.register('name')}
                      placeholder="Name"
                      disabled={isLoading}
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Input
                      {...registerForm.register('email')}
                      type="email"
                      placeholder="Email"
                      disabled={isLoading}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Input
                      {...registerForm.register('password')}
                      type="password"
                      placeholder="Password"
                      disabled={isLoading}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Input
                      {...registerForm.register('confirmPassword')}
                      type="password"
                      placeholder="Confirm Password"
                      disabled={isLoading}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <FormField
                    control={registerForm.control}
                    name="agreeToTerms"
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
                            I agree to the{' '}
                            <Link 
                              href="/terms" 
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link 
                              href="/privacy" 
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Privacy Policy
                            </Link>
                          </FormLabel>
                          {registerForm.formState.errors.agreeToTerms && (
                            <p className="text-sm text-red-500">
                              {registerForm.formState.errors.agreeToTerms.message}
                            </p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="agreeToMarketing"
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
                            I agree to receive occasional emails about new tools and updates
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !registerForm.formState.isValid}
                >
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full relative flex items-center justify-center bg-background hover:bg-secondary/80 border-border/50"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle className="w-5 h-5 absolute left-4" />
          <span>Google</span>
        </Button>

        <p className="text-xs text-center text-muted-foreground px-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  );
}