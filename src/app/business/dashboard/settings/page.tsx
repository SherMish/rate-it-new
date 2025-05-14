"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { isLoading, user } = useBusinessGuard();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    reviewAlerts: true,
    marketingEmails: false,
    email: user?.email || "",
    password: "",
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          הגדרות
        </h1>
        <p className="text-muted-foreground">ניהול העדפות החשבון שלך</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">התראות</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">התראות במייל</h3>
                <p className="text-sm text-muted-foreground">
                  קבלת עדכונים לגבי העסק שלך
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">התראות על ביקורות</h3>
                <p className="text-sm text-muted-foreground">
                  קבלת התראות על ביקורות חדשות
                </p>
              </div>
              <Switch
                checked={settings.reviewAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, reviewAlerts: checked })
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">הגדרות חשבון</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">כתובת אימייל</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">סיסמה חדשה</label>
              <Input
                type="password"
                value={settings.password}
                onChange={(e) =>
                  setSettings({ ...settings, password: e.target.value })
                }
                placeholder="הזן סיסמה חדשה"
              />
            </div>
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-primary to-purple-600 text-white">
                שמור שינויים
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
