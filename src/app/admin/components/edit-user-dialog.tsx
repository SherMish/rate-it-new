"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  isWebsiteOwner: boolean;
  isVerifiedWebsiteOwner: boolean;
  reviewCount: number;
  relatedWebsite: string | null;
  createdAt: string;
  workRole: string | null;
  workEmail: string | null;
  isAgreeMarketing: boolean;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
  user: UserType | null;
}

interface WebsiteOption {
  _id: string;
  name: string;
  url: string;
  logo?: string;
}

export function EditUserDialog({
  open,
  onOpenChange,
  onUserUpdated,
  user,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    isWebsiteOwner: false,
    isVerifiedWebsiteOwner: false,
    relatedWebsite: "",
    workRole: "",
    workEmail: "",
    isAgreeMarketing: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [websiteSearch, setWebsiteSearch] = useState("");
  const [websiteOptions, setWebsiteOptions] = useState<WebsiteOption[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteOption | null>(null);
  const [showWebsiteDropdown, setShowWebsiteDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Reset form when dialog opens with new user
  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        isWebsiteOwner: user.isWebsiteOwner,
        isVerifiedWebsiteOwner: user.isVerifiedWebsiteOwner,
        relatedWebsite: user.relatedWebsite || "",
        workRole: user.workRole || "",
        workEmail: user.workEmail || "",
        isAgreeMarketing: user.isAgreeMarketing || false,
      });
      setWebsiteSearch(user.relatedWebsite || "");
      setSelectedWebsite(null);
      setShowWebsiteDropdown(false);
      setWebsiteOptions([]);
      setHasUserInteracted(false);
    }
  }, [user, open]);

  // Debounced website search
  useEffect(() => {
    // Don't search if user hasn't interacted with the field yet
    if (!hasUserInteracted) {
      return;
    }

    if (!websiteSearch || websiteSearch.length < 2) {
      setWebsiteOptions([]);
      setShowWebsiteDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/admin/websites/search?q=${encodeURIComponent(websiteSearch)}`
        );
        if (response.ok) {
          const data = await response.json();
          setWebsiteOptions(data);
          setShowWebsiteDropdown(data.length > 0);
        }
      } catch (error) {
        console.error("Error searching websites:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [websiteSearch, hasUserInteracted]);

  const handleSubmit = async () => {
    if (!user?._id) return;

    // Validate that a website is selected
    if (websiteSearch && !selectedWebsite) {
      setFormError("אנא בחר עסק מהרשימה");
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const response = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          relatedWebsite: selectedWebsite ? selectedWebsite.url : "",
          websiteId: selectedWebsite ? selectedWebsite._id : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || "עדכון המשתמש נכשל");
        return;
      }

      toast.success("המשתמש עודכן בהצלחה");
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setFormError("עדכון המשתמש נכשל. אנא נסו שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromBusiness = async () => {
    if (!user?._id || !selectedWebsite) return;

    setIsRemoving(true);
    setFormError(null);

    try {
      const response = await fetch(`/api/admin/users/${user._id}/remove-business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId: selectedWebsite._id,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || "הסרת המשתמש מהעסק נכשלה");
        return;
      }

      toast.success("המשתמש הוסר מהעסק בהצלחה");
      setShowRemoveConfirm(false);
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error removing user from business:", error);
      setFormError("הסרת המשתמש מהעסק נכשלה. אנא נסו שוב.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">
            עריכת משתמש: {user?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {formError && (
            <p className="text-sm text-red-500 mb-4 text-right">
              ❌ {formError}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">שם</Label>
              <Input
                placeholder="שם המשתמש"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">אימייל</Label>
              <Input
                placeholder="אימייל"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="text-right"
                dir="rtl"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">סוג משתמש</Label>
              <Select
                dir="rtl"
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר תפקיד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">משתמש</SelectItem>
                  <SelectItem value="business_owner">בעל עסק</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right block">עסק משויך</Label>
              <div className="relative">
                <Input
                  placeholder="חפש עסק (לפחות 2 תווים)"
                  value={websiteSearch}
                  onChange={(e) => {
                    setWebsiteSearch(e.target.value);
                    setSelectedWebsite(null);
                    setHasUserInteracted(true);
                  }}
                  onFocus={() => {
                    setHasUserInteracted(true);
                    if (websiteOptions.length > 0) {
                      setShowWebsiteDropdown(true);
                    }
                  }}
                  className="text-right"
                  dir="rtl"
                />
                {isSearching && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
                {showWebsiteDropdown && websiteOptions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {websiteOptions.map((website) => (
                      <div
                        key={website._id}
                        className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                        onClick={() => {
                          setSelectedWebsite(website);
                          setWebsiteSearch(website.name);
                          setShowWebsiteDropdown(false);
                          setFormData((prev) => ({
                            ...prev,
                            relatedWebsite: website.url,
                          }));
                        }}
                      >
                        {website.logo && (
                          <img
                            src={website.logo}
                            alt={website.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 text-right">
                          <div className="font-medium">{website.name}</div>
                          <div className="text-sm text-gray-500">
                            {website.url}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedWebsite && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedWebsite(null);
                        setWebsiteSearch("");
                        setFormData((prev) => ({
                          ...prev,
                          relatedWebsite: "",
                        }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm">
                        <div className="font-medium">{selectedWebsite.name}</div>
                        <div className="text-gray-600">{selectedWebsite.url}</div>
                      </div>
                      {selectedWebsite.logo && (
                        <img
                          src={selectedWebsite.logo}
                          alt={selectedWebsite.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">תפקיד בעבודה</Label>
              <Input
                placeholder="תפקיד בעבודה"
                value={formData.workRole}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workRole: e.target.value,
                  }))
                }
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">אימייל עבודה</Label>
              <Input
                placeholder="אימייל עבודה"
                value={formData.workEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workEmail: e.target.value,
                  }))
                }
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={formData.isWebsiteOwner}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isWebsiteOwner: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <Label className="text-right">בעל עסק</Label>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={formData.isVerifiedWebsiteOwner}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVerifiedWebsiteOwner: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <Label className="text-right">בעל עסק מאומת</Label>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={formData.isAgreeMarketing}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAgreeMarketing: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <Label className="text-right">מסכים לקבל עדכונים</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            {selectedWebsite && formData.relatedWebsite && (
              <Button
                onClick={() => setShowRemoveConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-800 shadow-lg"
                disabled={isRemoving || isLoading}
                type="button"
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    מסיר...
                  </>
                ) : (
                  <>
                    ⚠️ הסר מהעסק
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              className="gradient-button"
              disabled={isLoading || isRemoving}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  שומר שינויים...
                </>
              ) : (
                "שמור שינויים"
              )}
            </Button>
          </div>

          {/* Remove Confirmation Dialog */}
          {showRemoveConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl border-4 border-red-600">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">⚠️</div>
                  <h3 className="text-xl font-bold text-red-600 mb-2">
                    אזהרה!
                  </h3>
                  <p className="text-gray-700 mb-4">
                    האם אתה בטוח שברצונך להסיר את המשתמש מהעסק?
                  </p>
                  <div className="bg-red-50 border-2 border-red-200 rounded p-3 mb-4">
                    <p className="text-sm text-right text-red-800 font-semibold">
                      פעולה זו תבצע:
                    </p>
                    <ul className="text-sm text-right text-red-700 mt-2 space-y-1">
                      <li>• ביטול אימות העסק</li>
                      <li>• הסרת קישור למשתמש</li>
                      <li>• שינוי סוג המשתמש ל&quot;משתמש רגיל&quot;</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowRemoveConfirm(false)}
                    disabled={isRemoving}
                  >
                    ביטול
                  </Button>
                  <Button
                    onClick={handleRemoveFromBusiness}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={isRemoving}
                  >
                    {isRemoving ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        מסיר...
                      </>
                    ) : (
                      "כן, הסר מהעסק"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
