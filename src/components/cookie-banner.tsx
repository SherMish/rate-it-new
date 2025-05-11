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
  const { showBanner, showSettings, settings, setShowSettings, saveSettings } = useCookieConsent();
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
        >
          <div className="container mx-auto max-w-7xl py-8 px-4">
            <div className="flex flex-col items-center gap-6">
              <div className="space-y-4 text-center max-w-3xl">
                <h3 className="text-lg font-semibold">Cookie Settings</h3>
                <p className="text-base text-muted-foreground">
                  This site uses cookies and related technologies, as described in our privacy policy, for purposes that may include site operation, analytics, enhanced user experience, or advertising. You may choose to consent to our use of these technologies, or manage your own preferences.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettings(true)}
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  Customize
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => saveSettings(defaultSettings)}
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  Decline All
                </Button>
                <Button 
                  onClick={() => saveSettings({ ...defaultSettings, analytics: true, marketing: true })}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold 
                           shadow-lg hover:shadow-xl transition-all px-8 py-6 min-w-[140px]"
                  size="lg"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cookie Settings</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Required cookies are necessary for the website to function and cannot be disabled.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Required Cookies</Label>
                <div className="text-sm text-muted-foreground">
                  Necessary for the website to function properly
                </div>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics Cookies</Label>
                <div className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website
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
                <Label>Marketing Cookies</Label>
                <div className="text-sm text-muted-foreground">
                  Used to deliver personalized advertisements
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
              Cancel
            </Button>
            <Button onClick={() => saveSettings(tempSettings)}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 