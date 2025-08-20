"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Don't show footer on business registration pages
  if (pathname?.startsWith("/business/register")) {
    return null;
  }

  // Don't show footer on business pricing pages when coming from dashboard
  if (pathname === "/business/pricing" && searchParams?.get("from") === "dashboard") {
    return null;
  }

  // Don't show footer on business upgrade/payment pages
  if (pathname?.startsWith("/business/upgrade")) {
    return null;
  }

  return <Footer />;
}
