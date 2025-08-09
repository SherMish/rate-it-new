"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardContainerProps = {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
};

export default function DashboardContainer({
  children,
  title,
  subtitle,
  className,
}: DashboardContainerProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)} dir="rtl">
      {title ? <h1 className="text-2xl font-bold mb-6">{title}</h1> : null}
      {subtitle ? (
        <p className="text-muted-foreground mb-8">{subtitle}</p>
      ) : null}
      {children}
    </div>
  );
}
