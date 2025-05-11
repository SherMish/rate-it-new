"use client";

import { createContext, useContext, useState } from "react";
import { LoginModal } from "@/components/auth/login-modal";

type LoginModalContextType = {
  showLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextType>({
  showLoginModal: () => {},
});

export const useLoginModal = () => {
  return useContext(LoginModalContext);
};

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const showLoginModal = () => setIsOpen(true);
  const handleLogin = () => setIsOpen(false);

  return (
    <LoginModalContext.Provider value={{ showLoginModal }}>
      {children}
      <LoginModal/>
    </LoginModalContext.Provider>
  );
}