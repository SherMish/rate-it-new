"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import categoriesData from "@/lib/data/categories.json";
import { ImageUpload } from "@/components/image-upload";

const CHAR_LIMITS = {
  name: 50,
  shortDescription: 100,
  description: 1000,
};

interface FormData {
  name: string;
  url: string;
  categories: string[];
  description: string;
  shortDescription: string;
  logo: string | undefined;
  pricingModel: string;
  launchYear: number | null;
  address: string;
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
  };
  socialUrls: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
}

interface FormErrors {
  name?: string;
  shortDescription?: string;
  description?: string;
  address?: string;
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  socialUrls?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export default function ToolPage() {
  const { isLoading, website } = useBusinessGuard();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "",
    categories: [],
    description: "",
    shortDescription: "",
    logo: undefined,
    pricingModel: "",
    launchYear: null,
    address: "",
    contact: {
      email: "",
      phone: "",
      whatsapp: "",
    },
    socialUrls: {},
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [alertError, setAlertError] = useState<string | null>(null);
  const [hasAppliedCurrentData, setHasAppliedCurrentData] = useState(false);

  // URL validation helper function
  const isValidUrl = (url: string) => {
    if (!url) return true;
    const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    try {
      new URL(urlWithProtocol);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Email validation helper function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation helper function
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\+\*]?[0-9\s\-\(\)]{3,20}$/;
    return phoneRegex.test(phone);
  };

  // WhatsApp validation helper function - allows both phone numbers and wa.me links
  const isValidWhatsApp = (whatsapp: string) => {
    if (!whatsapp) return true;

    // Trim whitespace
    const trimmedWhatsapp = whatsapp.trim();

    // Check if it's a wa.me link or WhatsApp API link
    if (
      trimmedWhatsapp.startsWith("https://wa.me/") ||
      trimmedWhatsapp.startsWith("http://wa.me/") ||
      trimmedWhatsapp.startsWith("wa.me/") ||
      trimmedWhatsapp.startsWith("https://api.whatsapp.com/send/") ||
      trimmedWhatsapp.startsWith("http://api.whatsapp.com/send/")
    ) {
      return true;
    }

    // Check if it's a valid phone number (more flexible regex)
    const phoneRegex = /^[\+\*]?[0-9\s\-\(\)\.]{3,20}$/;
    return phoneRegex.test(trimmedWhatsapp);
  };

  useEffect(() => {
    if (website && !hasAppliedCurrentData) {
      setFormData({
        name: website.name,
        url: website.url,
        categories: website.categories || [],
        description: website.description || "",
        shortDescription: website.shortDescription || "",
        logo: website.logo || undefined,
        pricingModel: website.pricingModel || "",
        launchYear: website.launchYear || null,
        address: website.address || "",
        contact: {
          email: website.contact?.email || "",
          phone: website.contact?.phone || "",
          whatsapp: website.contact?.whatsapp || "",
        },
        socialUrls: website.socialUrls || {},
      });
      setHasAppliedCurrentData(true);
    }
  }, [website]);

  const handleSave = async () => {
    try {
      // Validate fields
      const newErrors: FormErrors = {};

      if (!formData.name.trim()) {
        newErrors.name = "נדרש שם עסק";
      }
      if (!formData.shortDescription.trim()) {
        newErrors.shortDescription = "נדרש תיאור קצר";
      }
      if (!formData.description.trim()) {
        newErrors.description = "נדרש תיאור";
      }

      // Validate social media URLs if provided
      const socialErrors: { [key: string]: string } = {};

      if (
        formData.socialUrls.facebook &&
        !isValidUrl(formData.socialUrls.facebook)
      ) {
        socialErrors.facebook = "נא להזין כתובת URL תקינה";
      }
      if (
        formData.socialUrls.instagram &&
        !isValidUrl(formData.socialUrls.instagram)
      ) {
        socialErrors.instagram = "נא להזין כתובת URL תקינה";
      }
      if (
        formData.socialUrls.twitter &&
        !isValidUrl(formData.socialUrls.twitter)
      ) {
        socialErrors.twitter = "נא להזין כתובת URL תקינה";
      }
      if (
        formData.socialUrls.tiktok &&
        !isValidUrl(formData.socialUrls.tiktok)
      ) {
        socialErrors.tiktok = "נא להזין כתובת URL תקינה";
      }
      if (
        formData.socialUrls.linkedin &&
        !isValidUrl(formData.socialUrls.linkedin)
      ) {
        socialErrors.linkedin = "נא להזין כתובת URL תקינה";
      }
      if (
        formData.socialUrls.youtube &&
        !isValidUrl(formData.socialUrls.youtube)
      ) {
        socialErrors.youtube = "נא להזין כתובת URL תקינה";
      }

      if (Object.keys(socialErrors).length > 0) {
        newErrors.socialUrls = socialErrors as any;
      }

      // Validate contact fields if provided
      const contactErrors: { [key: string]: string } = {};

      if (formData.contact.email && !isValidEmail(formData.contact.email)) {
        contactErrors.email = "נא להזין כתובת אימייל תקינה";
      }
      if (formData.contact.phone && !isValidPhone(formData.contact.phone)) {
        contactErrors.phone = "נא להזין מספר טלפון תקין";
      }
      if (
        formData.contact.whatsapp &&
        !isValidWhatsApp(formData.contact.whatsapp)
      ) {
        contactErrors.whatsapp = "נא להזין מספר וואטסאפ תקין או קישור";
      }

      if (Object.keys(contactErrors).length > 0) {
        newErrors.contact = contactErrors as any;
      }

      setFormErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        toast.error("אנא מלאו את כל השדות הנדרשים");
        return;
      }

      setIsSaving(true);

      // Filter out empty categories before sending
      const cleanedCategories = formData.categories.filter((cat) => cat.trim());
      const dataToSend = {
        ...formData,
        categories: cleanedCategories,
      };

      const response = await fetch(`/api/admin/websites/${website?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "עדכון נכשל");
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000); // Hide after 10 seconds
      setFormErrors({});
    } catch (error) {
      console.error("Error updating website:", error);
      toast.error(
        error instanceof Error ? error.message : "עדכון העסק נכשל. אנא נסו שוב."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium">לוגו</label>
              <ImageUpload
                value={formData.logo || ""}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, logo: url }))
                }
                onRemove={() => setFormData((prev) => ({ ...prev, logo: "" }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="grid gap-2 md:col-span-1">
                <label className="text-sm font-medium">שם העסק</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="הזן את שם העסק"
                  maxLength={CHAR_LIMITS.name}
                  className={`${formErrors.name ? "border-red-500" : ""}`}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.name.length} / {CHAR_LIMITS.name}
                </p>
              </div>

              <div className="grid gap-2 md:col-span-3">
                <label className="text-sm font-medium">תיאור קצר</label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  placeholder="תיאור קצר של העסק שלך"
                  maxLength={CHAR_LIMITS.shortDescription}
                  className={`${
                    formErrors.shortDescription ? "border-red-500" : ""
                  }`}
                />
                {formErrors.shortDescription && (
                  <p className="text-sm text-red-500">
                    {formErrors.shortDescription}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.shortDescription.length} /{" "}
                  {CHAR_LIMITS.shortDescription}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="grid gap-2">
                <label className="text-sm font-medium">קטגוריות (עד 3)</label>

                {formData.categories.length === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        categories: [""],
                      }));
                    }}
                    className="w-full justify-start text-muted-foreground h-10"
                  >
                    + הוסף קטגוריה ראשונה
                  </Button>
                )}

                <div className="space-y-2">
                  {formData.categories.map((category, index) => (
                    <div key={index} className="flex gap-2">
                      <Select
                        dir="rtl"
                        value={category}
                        onValueChange={(value) => {
                          const newCategories = [...formData.categories];
                          newCategories[index] = value;
                          setFormData((prev) => ({
                            ...prev,
                            categories: newCategories,
                          }));
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="בחר קטגוריה" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesData.categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newCategories = formData.categories.filter(
                            (_, i) => i !== index
                          );
                          setFormData((prev) => ({
                            ...prev,
                            categories: newCategories,
                          }));
                        }}
                        className="px-3 h-10"
                      >
                        ×
                      </Button>
                    </div>
                  ))}

                  {formData.categories.length > 0 &&
                    formData.categories.length < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            categories: [...prev.categories, ""],
                          }));
                        }}
                        className="w-full text-sm text-muted-foreground h-10"
                      >
                        + הוסף קטגוריה נוספת
                      </Button>
                    )}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">כתובת URL</label>
                <Input
                  disabled={true}
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="הזן את כתובת האתר"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">תיאור</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="תיאור מפורט של העסק שלך"
                className={`w-full h-32 rounded-md border px-3 py-2 text-sm ${
                  formErrors.description ? "border-red-500" : ""
                }`}
                maxLength={CHAR_LIMITS.description}
              />
              {formErrors.description && (
                <p className="text-sm text-red-500">{formErrors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.description.length} / {CHAR_LIMITS.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-medium">שנת השקה</label>
                <Input
                  type="number"
                  value={formData.launchYear?.toString() || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      launchYear: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    }))
                  }
                  min={2000}
                  max={new Date().getFullYear()}
                  placeholder="שנת השקה (אופציונלי)"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">כתובת</label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="כתובת העסק (אופציונלי)"
                  className={formErrors.address ? "border-red-500" : ""}
                />
                {formErrors.address && (
                  <p className="text-sm text-red-500">{formErrors.address}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-border pt-4 mt-2">
              <h3 className="text-lg font-medium mb-4">פרטי יצירת קשר</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">אימייל</label>
                  <Input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          email: e.target.value,
                        },
                      }))
                    }
                    placeholder="example@domain.com"
                    className={
                      formErrors.contact?.email ? "border-red-500" : ""
                    }
                  />
                  {formErrors.contact?.email && (
                    <p className="text-sm text-red-500">
                      {formErrors.contact.email}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">טלפון</label>
                  <Input
                    value={formData.contact.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          phone: e.target.value,
                        },
                      }))
                    }
                    placeholder="050-1234567"
                    className={
                      formErrors.contact?.phone ? "border-red-500" : ""
                    }
                  />
                  {formErrors.contact?.phone && (
                    <p className="text-sm text-red-500">
                      {formErrors.contact.phone}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">וואטסאפ</label>
                  <Input
                    value={formData.contact.whatsapp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          whatsapp: e.target.value,
                        },
                      }))
                    }
                    placeholder="972501234567 או https://wa.me/972501234567"
                    className={
                      formErrors.contact?.whatsapp ? "border-red-500" : ""
                    }
                  />
                  {formErrors.contact?.whatsapp && (
                    <p className="text-sm text-red-500">
                      {formErrors.contact.whatsapp}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="border-t border-border pt-4 mt-2">
              <h3 className="text-lg font-medium mb-4">רשתות חברתיות</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">פייסבוק</label>
                  <Input
                    value={formData.socialUrls?.facebook || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialUrls: {
                          ...prev.socialUrls,
                          facebook: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://facebook.com/yourpage"
                    className={
                      formErrors.socialUrls?.facebook ? "border-red-500" : ""
                    }
                  />
                  {formErrors.socialUrls?.facebook && (
                    <p className="text-sm text-red-500">
                      {formErrors.socialUrls.facebook}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">אינסטגרם</label>
                  <Input
                    value={formData.socialUrls?.instagram || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialUrls: {
                          ...prev.socialUrls,
                          instagram: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://instagram.com/yourhandle"
                    className={
                      formErrors.socialUrls?.instagram ? "border-red-500" : ""
                    }
                  />
                  {formErrors.socialUrls?.instagram && (
                    <p className="text-sm text-red-500">
                      {formErrors.socialUrls.instagram}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">טוויטר</label>
                  <Input
                    value={formData.socialUrls?.twitter || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialUrls: {
                          ...prev.socialUrls,
                          twitter: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://twitter.com/yourhandle"
                    className={
                      formErrors.socialUrls?.twitter ? "border-red-500" : ""
                    }
                  />
                  {formErrors.socialUrls?.twitter && (
                    <p className="text-sm text-red-500">
                      {formErrors.socialUrls.twitter}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">טיקטוק</label>
                  <Input
                    value={formData.socialUrls?.tiktok || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialUrls: {
                          ...prev.socialUrls,
                          tiktok: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://tiktok.com/@yourhandle"
                    className={
                      formErrors.socialUrls?.tiktok ? "border-red-500" : ""
                    }
                  />
                  {formErrors.socialUrls?.tiktok && (
                    <p className="text-sm text-red-500">
                      {formErrors.socialUrls.tiktok}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">לינקדאין</label>
                  <Input
                    value={formData.socialUrls?.linkedin || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialUrls: {
                          ...prev.socialUrls,
                          linkedin: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://linkedin.com/company/yourcompany"
                    className={
                      formErrors.socialUrls?.linkedin ? "border-red-500" : ""
                    }
                  />
                  {formErrors.socialUrls?.linkedin && (
                    <p className="text-sm text-red-500">
                      {formErrors.socialUrls.linkedin}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">יוטיוב</label>
                  <Input
                    value={formData.socialUrls?.youtube || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialUrls: {
                          ...prev.socialUrls,
                          youtube: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://youtube.com/channel/yourchannel"
                    className={
                      formErrors.socialUrls?.youtube ? "border-red-500" : ""
                    }
                  />
                  {formErrors.socialUrls?.youtube && (
                    <p className="text-sm text-red-500">
                      {formErrors.socialUrls.youtube}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {showSuccess && (
                <p className="text-sm text-green-500">
                  ✅ פרטי העסק שלך עודכנו בהצלחה!
                </p>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gradient-button"
                >
                  {isSaving ? "שומר..." : "שמור שינויים"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
