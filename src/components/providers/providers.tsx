"use client";

import { SessionProvider } from "next-auth/react";
import { LoginModalProvider } from '@/components/providers/login-modal-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LoginModalProvider>
        {children}
      </LoginModalProvider>
    </SessionProvider>
  );
} 