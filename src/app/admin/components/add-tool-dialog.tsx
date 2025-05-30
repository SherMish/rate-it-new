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
import { WebsiteType } from "@/lib/models/Website";
import categoriesData from "@/lib/data/categories.json";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "react-hot-toast";

interface AddToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToolAdded: () => void;
  website?: WebsiteType | null; // Optional website for edit mode
  generatedData?: Partial<WebsiteType> | null;
}

const CHAR_LIMITS = {
  name: 50,
  shortDescription: 100,
  description: 1000,
};

export function AddToolDialog({
  open,
  onOpenChange,
  onToolAdded,
  website = null,
  generatedData = null,
}: AddToolDialogProps) {
  const isEditMode = !!website;

  const [formData, setFormData] = useState({
    url: "",
    name: "",
    category: "",
    description: "",
    shortDescription: "",
    logo: "",
    pricingModel: "free",
    launchYear: new Date().getFullYear(),
    address: "",
    contact: {
      email: "",
      phone: "",
      whatsapp: "",
    },
    socialUrls: {
      facebook: "",
      instagram: "",
      twitter: "",
      tiktok: "",
      linkedin: "",
      youtube: "",
    },
    // License management fields
    isVerified: false,
    isVerifiedByRateIt: false,
    licenseValidDate: "",
    isActive: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newWebsite, setNewWebsite] = useState<WebsiteType | null>(null);
  const [generatedDataState, setGeneratedDataState] =
    useState<Partial<WebsiteType> | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Initialize form data when website prop changes (edit mode)
  useEffect(() => {
    if (website) {
      setFormData({
        url: website.url || "",
        name: website.name || "",
        category: website.category || "",
        description: website.description || "",
        shortDescription: website.shortDescription || "",
        logo: website.logo || "",
        pricingModel: website.pricingModel || "free",
        launchYear: website.launchYear || new Date().getFullYear(),
        address: website.address || "",
        contact: {
          email: website.contact?.email || "",
          phone: website.contact?.phone || "",
          whatsapp: website.contact?.whatsapp || "",
        },
        socialUrls: {
          facebook: website.socialUrls?.facebook || "",
          instagram: website.socialUrls?.instagram || "",
          twitter: website.socialUrls?.twitter || "",
          tiktok: website.socialUrls?.tiktok || "",
          linkedin: website.socialUrls?.linkedin || "",
          youtube: website.socialUrls?.youtube || "",
        },
        isVerified: website.isVerified || false,
        isVerifiedByRateIt: website.isVerifiedByRateIt || false,
        licenseValidDate: website.licenseValidDate
          ? new Date(website.licenseValidDate).toISOString().split("T")[0]
          : "",
        isActive: website.isActive !== undefined ? website.isActive : true,
      });
    } else {
      // Reset for add mode
      setFormData({
        url: "",
        name: "",
        category: "",
        description: "",
        shortDescription: "",
        logo: "",
        pricingModel: "free",
        launchYear: new Date().getFullYear(),
        address: "",
        contact: {
          email: "",
          phone: "",
          whatsapp: "",
        },
        socialUrls: {
          facebook: "",
          instagram: "",
          twitter: "",
          tiktok: "",
          linkedin: "",
          youtube: "",
        },
        isVerified: false,
        isVerifiedByRateIt: false,
        licenseValidDate: "",
        isActive: true,
      });
    }
    setFormErrors({});
    setFormError(null);
  }, [website, open]);

  // Set generated data when provided
  useEffect(() => {
    if (generatedData) {
      setGeneratedDataState(generatedData);
    }
  }, [generatedData]);

  // Reset state when dialog is closed
  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open && !isEditMode) {
      setNewWebsite(null);
      setGeneratedDataState(null);
      setFormData({
        url: "",
        name: "",
        category: "",
        description: "",
        shortDescription: "",
        logo: "",
        pricingModel: "free",
        launchYear: new Date().getFullYear(),
        address: "",
        contact: {
          email: "",
          phone: "",
          whatsapp: "",
        },
        socialUrls: {
          facebook: "",
          instagram: "",
          twitter: "",
          tiktok: "",
          linkedin: "",
          youtube: "",
        },
        isVerified: false,
        isVerifiedByRateIt: false,
        licenseValidDate: "",
        isActive: true,
      });
      setFormErrors({});
      setFormError(null);
    }
  };

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
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "נדרש שם עסק";
    }
    if (!formData.url.trim()) {
      errors.url = "נדרשת כתובת אתר";
    }
    if (!formData.shortDescription.trim()) {
      errors.shortDescription = "נדרש תיאור קצר";
    }
    if (!formData.description.trim()) {
      errors.description = "נדרש תיאור";
    }
    if (!formData.category) {
      errors.category = "נדרשת קטגוריה";
    }

    // Validate social media URLs
    if (
      formData.socialUrls.facebook &&
      !isValidUrl(formData.socialUrls.facebook)
    ) {
      errors.facebook = "כתובת פייסבוק לא תקינה";
    }
    if (
      formData.socialUrls.instagram &&
      !isValidUrl(formData.socialUrls.instagram)
    ) {
      errors.instagram = "כתובת אינסטגרם לא תקינה";
    }
    if (
      formData.socialUrls.twitter &&
      !isValidUrl(formData.socialUrls.twitter)
    ) {
      errors.twitter = "כתובת טוויטר לא תקינה";
    }
    if (formData.socialUrls.tiktok && !isValidUrl(formData.socialUrls.tiktok)) {
      errors.tiktok = "כתובת טיקטוק לא תקינה";
    }
    if (
      formData.socialUrls.linkedin &&
      !isValidUrl(formData.socialUrls.linkedin)
    ) {
      errors.linkedin = "כתובת לינקדאין לא תקינה";
    }
    if (
      formData.socialUrls.youtube &&
      !isValidUrl(formData.socialUrls.youtube)
    ) {
      errors.youtube = "כתובת יוטיוב לא תקינה";
    }

    // Validate contact fields if provided
    if (formData.contact.email && !isValidEmail(formData.contact.email)) {
      errors.email = "כתובת אימייל לא תקינה";
    }
    if (formData.contact.phone && !isValidPhone(formData.contact.phone)) {
      errors.phone = "מספר טלפון לא תקין";
    }
    if (formData.contact.whatsapp && !isValidPhone(formData.contact.whatsapp)) {
      errors.whatsapp = "מספר וואטסאפ לא תקין";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyGeneratedData = () => {
    if (generatedDataState) {
      const updatedData = {
        ...generatedDataState,
        category: generatedDataState.category || formData.category,
      };

      setFormData((prev) => ({
        ...prev,
        name: updatedData.name || prev.name,
        description: updatedData.description || prev.description,
        shortDescription: updatedData.shortDescription || prev.shortDescription,
        category: updatedData.category || prev.category,
        logo: updatedData.logo || prev.logo,
        launchYear: updatedData.launchYear || prev.launchYear,
      }));
      toast.success("נתונים שנוצרו אוטומטית הוחלו בהצלחה");
      setGeneratedDataState(null);
    }
  };

  const handleSubmit = async () => {
    console.log("Starting form submission...");
    if (!validateForm()) {
      setFormError("אנא מלאו את כל השדות הנדרשים בצורה תקינה");
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      console.log("Form data being sent:", formData);

      if (isEditMode && website) {
        console.log("Updating existing website...");
        // Edit existing website
        const response = await fetch(`/api/admin/websites/${website._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log("Update response:", {
          ok: response.ok,
          status: response.status,
          data,
        });

        if (!response.ok) {
          console.error("Update failed:", data);
          setFormError(data.error || "עדכון העסק נכשל");
          return;
        }

        toast.success("העסק עודכן בהצלחה");
        onToolAdded();
        handleDialogChange(false);
      } else {
        console.log("Creating new website...");
        // Create new website
        const response = await fetch("/api/admin/websites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log("Create response:", {
          ok: response.ok,
          status: response.status,
          data,
        });

        if (!response.ok) {
          console.error("Creation failed:", data);
          if (data.error === "Website already exists") {
            setFormError("עסק זה כבר קיים במאגר");
          } else {
            setFormError(data.error || "יצירת העסק נכשלה");
          }
          return; // Don't close the modal on error
        }

        console.log("Website created successfully:", data);
        toast.success("העסק נוצר בהצלחה");
        onToolAdded();
        handleDialogChange(false);
      }
    } catch (error) {
      console.error("Error saving website:", error);
      setFormError(
        isEditMode
          ? "עדכון העסק נכשל. אנא נסו שוב."
          : "הוספת העסק נכשלה. אנא נסו שוב."
      );
      // Don't close the modal on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-right">
            {isEditMode ? `עריכת עסק: ${website?.name}` : "הוסף עסק חדש"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 text-right font-medium">
                ❌ {formError}
              </p>
            </div>
          )}

          {generatedDataState && (
            <div className="flex items-center justify-between py-2 px-4 bg-secondary rounded-lg">
              <Button size="sm" onClick={handleApplyGeneratedData}>
                החל שינויים
              </Button>
              <span className="text-sm">נתונים חדשים נוצרו אוטומטית</span>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-right block">לוגו</Label>
            <ImageUpload
              value={formData.logo || ""}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, logo: url }))
              }
              onRemove={() => setFormData((prev) => ({ ...prev, logo: "" }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">שם העסק</Label>
              <Input
                placeholder="הזן את שם העסק"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                maxLength={CHAR_LIMITS.name}
                className={`text-right ${
                  formErrors.name ? "border-red-500" : ""
                }`}
                dir="rtl"
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 text-right">
                  {formErrors.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground text-right">
                {formData.name.length} / {CHAR_LIMITS.name}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-right block">כתובת אתר</Label>
              <Input
                placeholder="example.co.il"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                className={`text-right ${
                  formErrors.url ? "border-red-500" : ""
                }`}
                dir="rtl"
                disabled={isEditMode} // Disable URL editing in edit mode
              />
              {formErrors.url && (
                <p className="text-sm text-red-500 text-right">
                  {formErrors.url}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-right block">תיאור קצר</Label>
            <Input
              placeholder="תיאור קצר של העסק"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
              maxLength={CHAR_LIMITS.shortDescription}
              className={`text-right ${
                formErrors.shortDescription ? "border-red-500" : ""
              }`}
              dir="rtl"
            />
            {formErrors.shortDescription && (
              <p className="text-sm text-red-500 text-right">
                {formErrors.shortDescription}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {formData.shortDescription.length} /{" "}
              {CHAR_LIMITS.shortDescription}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-right block">תיאור מפורט</Label>
            <textarea
              placeholder="תיאור מפורט של העסק"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              maxLength={CHAR_LIMITS.description}
              className={`w-full h-24 rounded-md border px-3 py-2 text-sm text-right ${
                formErrors.description ? "border-red-500" : ""
              }`}
              dir="rtl"
            />
            {formErrors.description && (
              <p className="text-sm text-red-500 text-right">
                {formErrors.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {formData.description.length} / {CHAR_LIMITS.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">קטגוריה</Label>
              <Select
                dir="rtl"
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger
                  className={formErrors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.category && (
                <p className="text-sm text-red-500 text-right">
                  {formErrors.category}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-right block">שנת השקה</Label>
              <Input
                type="number"
                value={formData.launchYear.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    launchYear:
                      parseInt(e.target.value) || new Date().getFullYear(),
                  }))
                }
                min={2000}
                max={new Date().getFullYear()}
                className="text-right"
                dir="rtl"
                placeholder="שנת השקה (אופציונלי)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-right block">כתובת</Label>
            <Input
              placeholder="כתובת העסק"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              className={`text-right ${
                formErrors.address ? "border-red-500" : ""
              }`}
              dir="rtl"
            />
            {formErrors.address && (
              <p className="text-sm text-red-500 text-right">
                {formErrors.address}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="border-t border-border pt-4">
            <Label className="text-right block mb-3 font-medium">
              פרטי יצירת קשר (אופציונלי)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-right block text-sm">אימייל</Label>
                <Input
                  type="email"
                  placeholder="example@domain.com"
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
                  className={`text-right ${
                    formErrors.email ? "border-red-500" : ""
                  }`}
                  dir="rtl"
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500 text-right">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-right block text-sm">טלפון</Label>
                <Input
                  placeholder="050-1234567"
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
                  className={`text-right ${
                    formErrors.phone ? "border-red-500" : ""
                  }`}
                  dir="rtl"
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500 text-right">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-right block text-sm">וואטסאפ</Label>
                <Input
                  placeholder="972501234567"
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
                  className={`text-right ${
                    formErrors.whatsapp ? "border-red-500" : ""
                  }`}
                  dir="rtl"
                />
                {formErrors.whatsapp && (
                  <p className="text-sm text-red-500 text-right">
                    {formErrors.whatsapp}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="border-t border-border pt-4">
            <Label className="text-right block mb-3 font-medium">
              רשתות חברתיות (אופציונלי)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-right block text-sm">פייסבוק</Label>
                <Input
                  placeholder="https://facebook.com/yourpage"
                  value={formData.socialUrls.facebook}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialUrls: {
                        ...prev.socialUrls,
                        facebook: e.target.value,
                      },
                    }))
                  }
                  className={`text-right ${
                    formErrors.facebook ? "border-red-500" : ""
                  }`}
                  dir="rtl"
                />
                {formErrors.facebook && (
                  <p className="text-sm text-red-500 text-right">
                    {formErrors.facebook}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-right block text-sm">אינסטגרם</Label>
                <Input
                  placeholder="https://instagram.com/yourhandle"
                  value={formData.socialUrls.instagram}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialUrls: {
                        ...prev.socialUrls,
                        instagram: e.target.value,
                      },
                    }))
                  }
                  className={`text-right ${
                    formErrors.instagram ? "border-red-500" : ""
                  }`}
                  dir="rtl"
                />
                {formErrors.instagram && (
                  <p className="text-sm text-red-500 text-right">
                    {formErrors.instagram}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-right block text-sm">טוויטר</Label>
                <Input
                  placeholder="https://twitter.com/yourhandle"
                  value={formData.socialUrls.twitter}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialUrls: {
                        ...prev.socialUrls,
                        twitter: e.target.value,
                      },
                    }))
                  }
                  className={`text-right ${
                    formErrors.twitter ? "border-red-500" : ""
                  }`}
                  dir="rtl"
                />
                {formErrors.twitter && (
                  <p className="text-sm text-red-500 text-right">
                    {formErrors.twitter}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-right block text-sm">טיקטוק</Label>
                <Input
                  placeholder="https://tiktok.com/@yourhandle"
                  value={formData.socialUrls.tiktok}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialUrls: {
                        ...prev.socialUrls,
                        tiktok: e.target.value,
                      },
                    }))
                  }
                  className={`text-right ${
                    formErrors.tiktok ? "border-red-500" : ""
                  }`}
                  dir="rtl"
                />
                {formErrors.tiktok && (
                  <p className="text-sm text-red-500 text-right">
                    {formErrors.tiktok}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-right block text-sm">לינקדאין</Label>
                <Input
                  placeholder="https://linkedin.com/company/yourcompany"
                  value={formData.socialUrls.linkedin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialUrls: {
                        ...prev.socialUrls,
                        linkedin: e.target.value,
                      },
                    }))
                  }
                  className={`text-right ${
                    formErrors.linkedin ? "border-red-500" : ""
                  }`}
                  dir="rtl"
                />
                {formErrors.linkedin && (
                  <p className="text-sm text-red-500 text-right">
                    {formErrors.linkedin}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-right block text-sm">יוטיוב</Label>
                <Input
                  placeholder="https://youtube.com/channel/yourchannel"
                  value={formData.socialUrls.youtube}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialUrls: {
                        ...prev.socialUrls,
                        youtube: e.target.value,
                      },
                    }))
                  }
                  className={`text-right ${
                    formErrors.youtube ? "border-red-500" : ""
                  }`}
                  dir="rtl"
                />
                {formErrors.youtube && (
                  <p className="text-sm text-red-500 text-right">
                    {formErrors.youtube}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* License Management Section */}
          <div className="border-t-4 border-red-500 pt-6 mt-6">
            <h3 className="text-lg font-bold text-red-600 text-right mb-4">
              ניהול רשיון
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-right block">מודל תמחור</Label>
                  <Select
                    dir="rtl"
                    value={formData.pricingModel}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, pricingModel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר מודל תמחור" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">חינם</SelectItem>
                      <SelectItem value="pro">מקצועי</SelectItem>
                      <SelectItem value="plus">פלוס</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">תאריך תוקף רשיון</Label>
                  <Input
                    type="date"
                    value={formData.licenseValidDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        licenseValidDate: e.target.value,
                      }))
                    }
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isVerified: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <Label className="text-right">מאומת</Label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.isVerifiedByRateIt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isVerifiedByRateIt: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <Label className="text-right">מאומת על ידי רייט-איט</Label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <Label className="text-right">פעיל</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleDialogChange(false)}>
              ביטול
            </Button>
            <Button
              onClick={handleSubmit}
              className="gradient-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  {isEditMode ? "שומר..." : "יוצר עסק..."}
                </>
              ) : isEditMode ? (
                "שמור שינויים"
              ) : (
                "צור עסק"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
