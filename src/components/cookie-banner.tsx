"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

export function CookieBanner() {
  const { showBanner, dismissBanner } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <motion.div
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0.3 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-background/95 border-t border-border backdrop-blur-sm"
      dir="rtl"
    >
      <div className="container mx-auto max-w-7xl py-6 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-right flex-1">
            <p className="text-sm text-muted-foreground">
              אתר זה משתמש בקובצי עוגיות (Cookies) לצרכים הכוללים תפעול האתר,
              ניתוחים, שיפור חוויית המשתמש ופרסום כפי שמתואר במדיניות הפרטיות שלנו.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={dismissBanner}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold 
                       shadow-lg hover:shadow-xl transition-all px-6"
            >
              הבנתי
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
