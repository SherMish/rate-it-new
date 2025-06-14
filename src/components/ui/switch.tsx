"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    {...props}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      // background colours
      "data-[state=unchecked]:bg-input data-[state=checked]:bg-primary",
      className
    )}
  >
    {/* Thumb */}
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",

        // ────────────────  L T R   ────────────────
        // OFF  → left (0),  ON → right (+20px ≈ translate-x-5)
        "ltr:data-[state=unchecked]:translate-x-0  ltr:data-[state=checked]:translate-x-5",

        // ────────────────  R T L   ────────────────
        // OFF → right (0),  ON → left  (-20px ≈ -translate-x-5)
        "rtl:data-[state=unchecked]:translate-x-0  rtl:data-[state=checked]:-translate-x-5"
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;
