"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { defaultSettings } from "@/lib/types/cookie-consent";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

export function CookieBanner() {
  const { showBanner, showSettings, settings, setShowSettings, saveSettings } =
    useCookieConsent();
  const [tempSettings, setTempSettings] = useState(settings);

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {showBanner && (
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-background/95 border-t border-border backdrop-blur-sm"
          dir="rtl"
        >
          <div className="container mx-auto max-w-7xl py-8 px-4">
            <div className="flex flex-col items-center gap-6">
              <div className="space-y-4 text-center max-w-3xl">
                <h3 className="text-lg font-semibold">העדפות עוגיות</h3>
                <p className="text-base text-muted-foreground">
                  אתר זה משתמש בקובצי עוגיות (Cookies) ובטכנולוגיות דומות כפי
                  שמתואר במדיניות הפרטיות שלנו, לצרכים הכוללים תפעול האתר,
                  ניתוחים, שיפור חוויית המשתמש ופרסום. באפשרותך להסכים לשימוש
                  שלנו או לנהל את ההעדפות שלך.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  התאמה אישית
                </Button>
                <Button
                  variant="outline"
                  onClick={() => saveSettings(defaultSettings)}
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  דחייה של הכול
                </Button>
                <Button
                  onClick={() =>
                    saveSettings({
                      ...defaultSettings,
                      analytics: true,
                      marketing: true,
                    })
                  }
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold 
                           shadow-lg hover:shadow-xl transition-all px-8 py-6 min-w-[140px]"
                  size="lg"
                >
                  אישור הכול
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>הגדרות עוגיות</DialogTitle>
            <DialogDescription>
              נהל את העדפות קובצי העוגיות שלך. עוגיות הכרחיות נדרשות לתפקוד תקין
              של האתר ואינן ניתנות לביטול.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>עוגיות הכרחיות</Label>
                <div className="text-sm text-muted-foreground">
                  נדרשות לתפקוד תקין של האתר
                </div>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>עוגיות ניתוח</Label>
                <div className="text-sm text-muted-foreground">
                  עוזרות לנו להבין כיצד מבקרים משתמשים באתר
                </div>
              </div>
              <Switch
                checked={tempSettings.analytics}
                onCheckedChange={(checked) =>
                  setTempSettings({ ...tempSettings, analytics: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>עוגיות שיווק</Label>
                <div className="text-sm text-muted-foreground">
                  משמשות להצגת פרסומות מותאמות אישית
                </div>
              </div>
              <Switch
                checked={tempSettings.marketing}
                onCheckedChange={(checked) =>
                  setTempSettings({ ...tempSettings, marketing: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              ביטול
            </Button>
            <Button onClick={() => saveSettings(tempSettings)}>
              שמור העדפות
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
