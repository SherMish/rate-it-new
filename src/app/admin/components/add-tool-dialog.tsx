"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Loader2, Sparkles } from "lucide-react";
import { WebsiteType } from "@/lib/models/Website";
import categoriesData from "@/lib/data/categories.json";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "react-hot-toast";

interface AIAnalysisResult {
  name: string;
  nameEnglish?: string;
  shortDescription: string;
  description: string;
  categories: string[];
  launchYear?: number;
  address?: string;
  contact: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  socialUrls: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  confidence: number;
  warnings: string[];
}

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
    categories: [""] as string[],
    description: "",
    shortDescription: "",
    logo: "",
    pricingModel: "basic",
    launchYear: "",
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
  
  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [showAiPreview, setShowAiPreview] = useState(false);
  
  // URL duplicate checking state
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Initialize form data when website prop changes (edit mode)
  useEffect(() => {
    if (website) {
      setFormData({
        url: website.url || "",
        name: website.name || "",
        categories: website.categories || [""],
        description: website.description || "",
        shortDescription: website.shortDescription || "",
        logo: website.logo || "",
        pricingModel: website.pricingModel || "basic",
        launchYear: website.launchYear ? website.launchYear.toString() : "",
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
        categories: [""],
        description: "",
        shortDescription: "",
        logo: "",
        pricingModel: "basic",
        launchYear: "",
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
        categories: [""],
        description: "",
        shortDescription: "",
        logo: "",
        pricingModel: "basic",
        launchYear: "",
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
      setUrlError(null);
      setIsCheckingUrl(false);
    }
  };

  // AI Analysis function
  const handleAiAnalysis = async () => {
    if (!formData.url.trim()) {
      toast.error("אנא הזינו כתובת אתר תחילה");
      return;
    }

    setIsAnalyzing(true);
    setFormError(null);

    try {
      const response = await fetch('/api/admin/ai-analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formData.url }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze website');
      }

      setAiAnalysisResult(result.data);
      setShowAiPreview(true);
      
      // Show success message with confidence score
      const confidence = Math.round(result.data.confidence * 100);
      toast.success(`ניתוח הושלם בהצלחה! רמת ביטחון: ${confidence}%`);

      // Show warnings if any
      if (result.data.warnings && result.data.warnings.length > 0) {
        result.data.warnings.forEach((warning: string) => {
          toast(warning, { icon: '⚠️' });
        });
      }
      
    } catch (error) {
      console.error('AI analysis error:', error);
      setFormError(error instanceof Error ? error.message : 'שגיאה בניתוח האתר');
      toast.error('שגיאה בניתוח האתר');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // URL duplicate checking function
  const checkUrlExists = useCallback(async (url: string) => {
    if (!url.trim() || isEditMode) {
      setUrlError(null);
      return;
    }

    // Normalize URL for checking
    let normalizedUrl = url.trim().toLowerCase();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    setIsCheckingUrl(true);
    setUrlError(null);

    try {
      const response = await fetch(`/api/websites/find?url=${encodeURIComponent(normalizedUrl)}`);
      
      if (response.ok) {
        // Website exists
        setUrlError("אתר זה כבר קיים במערכת");
      } else if (response.status === 404) {
        // Website doesn't exist - this is good
        setUrlError(null);
      } else {
        // Other error, don't show error to user
        console.error('Error checking URL:', response.status);
        setUrlError(null);
      }
    } catch (error) {
      console.error('URL check error:', error);
      // Don't show error to user for network issues
      setUrlError(null);
    } finally {
      setIsCheckingUrl(false);
    }
  }, [isEditMode]);

  // Debounced URL checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUrlExists(formData.url);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData.url, checkUrlExists]);

  // Apply AI analysis results to form
  const handleApplyAiResults = () => {
    if (!aiAnalysisResult) return;

    setFormData(prev => ({
      ...prev,
      name: aiAnalysisResult.name || prev.name,
      shortDescription: aiAnalysisResult.shortDescription || prev.shortDescription,
      description: aiAnalysisResult.description || prev.description,
      categories: aiAnalysisResult.categories.length > 0 ? aiAnalysisResult.categories : prev.categories,
      launchYear: aiAnalysisResult.launchYear ? aiAnalysisResult.launchYear.toString() : prev.launchYear,
      address: aiAnalysisResult.address || prev.address,
      contact: {
        email: aiAnalysisResult.contact.email || prev.contact.email,
        phone: aiAnalysisResult.contact.phone || prev.contact.phone,
        whatsapp: aiAnalysisResult.contact.whatsapp || prev.contact.whatsapp,
      },
      socialUrls: {
        facebook: aiAnalysisResult.socialUrls.facebook || prev.socialUrls.facebook,
        instagram: aiAnalysisResult.socialUrls.instagram || prev.socialUrls.instagram,
        twitter: aiAnalysisResult.socialUrls.twitter || prev.socialUrls.twitter,
        tiktok: aiAnalysisResult.socialUrls.tiktok || prev.socialUrls.tiktok,
        linkedin: aiAnalysisResult.socialUrls.linkedin || prev.socialUrls.linkedin,
        youtube: aiAnalysisResult.socialUrls.youtube || prev.socialUrls.youtube,
      },
    }));

    setShowAiPreview(false);
    setAiAnalysisResult(null);
    toast.success("הנתונים הוחלו בהצלחה!");
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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "נדרש שם עסק";
    }
    if (!formData.url.trim()) {
      errors.url = "נדרשת כתובת אתר";
    }
    
    // Check for URL duplicate error
    if (urlError) {
      errors.url = urlError;
    }
    
    if (!formData.shortDescription.trim()) {
      errors.shortDescription = "נדרש תיאור קצר";
    }
    if (!formData.description.trim()) {
      errors.description = "נדרש תיאור";
    }
    if (
      formData.categories.length === 0 ||
      formData.categories.every((cat) => !cat.trim())
    ) {
      errors.categories = "נדרשת לפחות קטגוריה אחת";
    }
    // Check for duplicate categories
    const validCategories = formData.categories.filter((cat) => cat.trim());
    if (validCategories.length !== new Set(validCategories).size) {
      errors.categories = "לא ניתן לבחור קטגוריה יותר מפעם אחת";
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
    if (
      formData.contact.whatsapp &&
      !isValidWhatsApp(formData.contact.whatsapp)
    ) {
      errors.whatsapp = "מספר וואטסאפ או קישור לא תקין";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyGeneratedData = () => {
    if (generatedDataState) {
      const updatedData = {
        ...generatedDataState,
        categories: generatedDataState.categories || formData.categories,
      };

      setFormData((prev) => ({
        ...prev,
        name: updatedData.name || prev.name,
        description: updatedData.description || prev.description,
        shortDescription: updatedData.shortDescription || prev.shortDescription,
        categories: updatedData.categories || prev.categories,
        logo: updatedData.logo || prev.logo,
        launchYear: updatedData.launchYear
          ? updatedData.launchYear.toString()
          : prev.launchYear,
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
      // Filter out empty categories before sending
      const cleanedCategories = formData.categories.filter((cat) => cat.trim());
      const dataToSend = {
        ...formData,
        categories: cleanedCategories,
      };

      console.log("Form data being sent:", dataToSend);

      if (isEditMode && website) {
        console.log("Updating existing website...");
        // Edit existing website
        const response = await fetch(`/api/admin/websites/${website._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
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
          body: JSON.stringify(dataToSend),
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

          {/* AI Analysis Preview */}
          {showAiPreview && aiAnalysisResult && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleApplyAiResults}>
                    החל כל השינויים
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAiPreview(false)}>
                    ביטול
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    ניתוח AI הושלם (ביטחון: {Math.round(aiAnalysisResult.confidence * 100)}%)
                  </span>
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <strong>שם העסק:</strong> {aiAnalysisResult.name}
                    {aiAnalysisResult.nameEnglish && (
                      <span className="text-gray-500"> ({aiAnalysisResult.nameEnglish})</span>
                    )}
                  </div>
                  <div>
                    <strong>תיאור קצר:</strong> {aiAnalysisResult.shortDescription}
                  </div>
                  <div>
                    <strong>קטגוריות:</strong> {aiAnalysisResult.categories.map(catId => {
                      const cat = categoriesData.categories.find(c => c.id === catId);
                      return cat?.name || catId;
                    }).join(', ')}
                  </div>
                  {aiAnalysisResult.launchYear && (
                    <div><strong>שנת הקמה:</strong> {aiAnalysisResult.launchYear}</div>
                  )}
                  {aiAnalysisResult.address && (
                    <div><strong>כתובת:</strong> {aiAnalysisResult.address}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  {(aiAnalysisResult.contact.email || aiAnalysisResult.contact.phone || aiAnalysisResult.contact.whatsapp) && (
                    <div>
                      <strong>פרטי קשר:</strong>
                      <ul className="list-disc list-inside text-xs">
                        {aiAnalysisResult.contact.email && <li>אימייל: {aiAnalysisResult.contact.email}</li>}
                        {aiAnalysisResult.contact.phone && <li>טלפון: {aiAnalysisResult.contact.phone}</li>}
                        {aiAnalysisResult.contact.whatsapp && <li>וואטסאפ: {aiAnalysisResult.contact.whatsapp}</li>}
                      </ul>
                    </div>
                  )}
                  
                  {Object.values(aiAnalysisResult.socialUrls).some(url => url) && (
                    <div>
                      <strong>רשתות חברתיות:</strong>
                      <ul className="list-disc list-inside text-xs">
                        {aiAnalysisResult.socialUrls.facebook && <li>פייסבוק ✓</li>}
                        {aiAnalysisResult.socialUrls.instagram && <li>אינסטגרם ✓</li>}
                        {aiAnalysisResult.socialUrls.twitter && <li>טוויטר ✓</li>}
                        {aiAnalysisResult.socialUrls.linkedin && <li>לינקדאין ✓</li>}
                        {aiAnalysisResult.socialUrls.youtube && <li>יוטיוב ✓</li>}
                        {aiAnalysisResult.socialUrls.tiktok && <li>טיקטוק ✓</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {aiAnalysisResult.description && (
                <div className="pt-2 border-t border-blue-300">
                  <strong>תיאור מפורט:</strong>
                  <p className="text-sm text-gray-700 mt-1">{aiAnalysisResult.description}</p>
                </div>
              )}
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
              <div className="flex items-center justify-between">
                <Label className="text-right block">כתובת אתר</Label>
                {!isEditMode && formData.url.trim() && !urlError && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAiAnalysis}
                    disabled={isAnalyzing || isCheckingUrl}
                    className="flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isAnalyzing ? "מנתח..." : "מילוי אוטומטי"}
                  </Button>
                )}
              </div>
              <div className="relative">
                <Input
                  placeholder="example.co.il"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className={`text-right ${
                    formErrors.url || urlError ? "border-red-500" : ""
                  } ${isCheckingUrl ? "pr-10" : ""}`}
                  dir="rtl"
                  disabled={isEditMode} // Disable URL editing in edit mode
                />
                {isCheckingUrl && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              {formErrors.url && (
                <p className="text-sm text-red-500 text-right">
                  {formErrors.url}
                </p>
              )}
              {urlError && (
                <p className="text-sm text-red-500 text-right">
                  {urlError}
                </p>
              )}
              {!isEditMode && !urlError && (
                <p className="text-xs text-muted-foreground text-right">
                  💡 לחצו על &quot;מילוי אוטומטי&quot; כדי למלא אוטומטית את פרטי העסק באמצעות AI
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
            <div className="space-y-3">
              <Label className="text-right block">קטגוריות (עד 3)</Label>

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
                      <SelectTrigger
                        className={`flex-1 ${
                          formErrors.categories ? "border-red-500" : ""
                        }`}
                      >
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

                    {formData.categories.length > 1 && (
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
                    )}
                  </div>
                ))}
              </div>

              {formData.categories.length < 3 && (
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

              {formErrors.categories && (
                <p className="text-sm text-red-500 text-right">
                  {formErrors.categories}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-right block">שנת השקה (אופציונלי)</Label>
              <Input
                type="number"
                value={formData.launchYear}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    launchYear: e.target.value,
                  }))
                }
                min={1900}
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
                  placeholder="972501234567 או https://wa.me/972501234567"
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
