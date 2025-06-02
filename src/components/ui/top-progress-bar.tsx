"use client";

import { useLoading } from "@/contexts/loading-context";
import { ProgressBar } from "./progress-bar";

export function TopProgressBar() {
  const { isLoading } = useLoading();

  return <ProgressBar isLoading={isLoading} />;
}
