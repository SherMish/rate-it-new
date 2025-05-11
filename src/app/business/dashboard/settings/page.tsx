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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-black/50 backdrop-blur border border-white/[0.08]">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-200">Email Notifications</h3>
                <p className="text-sm text-gray-400">Receive updates about your tool</p>
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
                <h3 className="text-sm font-medium text-gray-200">Review Alerts</h3>
                <p className="text-sm text-gray-400">Get notified about new reviews</p>
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

        <Card className="p-6 bg-black/50 backdrop-blur border border-white/[0.08]">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Account Settings</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Email Address</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="bg-black/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">New Password</label>
              <Input
                type="password"
                value={settings.password}
                onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                className="bg-black/30"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 