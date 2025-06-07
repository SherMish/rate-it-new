"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on business registration pages
  if (pathname?.startsWith("/business/register")) {
    return null;
  }

  return <Footer />;
}
