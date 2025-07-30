"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Send,
  Phone,
  Star,
  Mail,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

interface WhatsAppReviewModalProps {
  websiteUrl: string;
  businessName: string;
  className?: string;
}

export function WhatsAppReviewModal({
  websiteUrl,
  businessName,
  className,
}: WhatsAppReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const reviewUrl = `https://rate-it.co.il/tool/${websiteUrl}/review`;
  const businessPageUrl = `https://rate-it.co.il/tool/${websiteUrl}`;

  // Format Israeli phone number (054-1234567 -> +972541234567)
  const formatIsraeliPhone = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Handle different Israeli phone formats
    if (cleaned.startsWith("972")) {
      // Already has country code
      return `+${cleaned}`;
    } else if (cleaned.startsWith("0")) {
      // Remove leading 0 and add +972
      return `+972${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      // 9 digits without leading 0
      return `+972${cleaned}`;
    }

    return phone; // Return as-is if format is unclear
  };

  const generateWhatsAppMessage = (): string => {
    if (customMessage.trim()) {
      return `${customMessage}\n\n${reviewUrl}`;
    }

    return `שלום! 👋

נשמח אם תוכל/י לכתוב ביקורת קצרה על השירות ב${businessName}.

זה לוקח רק דקה וממש עוזר לנו 🙏

${reviewUrl}

תודה רבה! ✨`;
  };

  const handleSendWhatsApp = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "נדרש מספר טלפון",
        description: "אנא הזן מספר טלפון תקין",
        variant: "destructive",
      });
      return;
    }

    const formattedPhone = formatIsraeliPhone(phoneNumber);
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone.replace(
      "+",
      ""
    )}&text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new window
    window.open(whatsappUrl, "_blank");

    toast({
      title: "WhatsApp נפתח!",
      description: "ההודעה מוכנה לשליחה",
    });

    // Reset form
    setPhoneNumber("");
    setCustomMessage("");
    setOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Allow only digits, spaces, dashes, and plus
    value = value.replace(/[^\d\s\-+]/g, "");

    setPhoneNumber(value);
  };

  const handleCopy = async (url: string, linkType: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(linkType);
      toast({
        title: "הקישור הועתק!",
        description: `${linkType} הועתק ללוח בהצלחה`,
      });
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      toast({
        title: "שגיאה בהעתקה",
        description: "לא ניתן להעתיק את הקישור כרגע",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className={`hover:shadow-lg transition-all ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-primary" />
            תנו ללקוחות לפרגן לכם – בקליק
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            שתפו את הקישור בסיום השירות – ותנו לביקורות לעבוד בשבילכם
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Copy Links Section */}
          <div>
            <div className="space-y-2">
              {/* Copy Business Page Link */}
              <button
                onClick={() => handleCopy(businessPageUrl, "דף העסק")}
                className="w-full flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/70 hover:bg-secondary/70 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">
                    קישור לדף העסק
                  </span>
                </div>
                <div className="p-1.5">
                  {copiedLink === "דף העסק" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </button>

              {/* Copy Review Link */}
              <button
                onClick={() => handleCopy(reviewUrl, "קישור לכתיבת ביקורת")}
                className="w-full flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/70 hover:bg-secondary/70 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">
                    קישור לכתיבת ביקורת
                  </span>
                </div>
                <div className="p-1.5">
                  {copiedLink === "קישור לכתיבת ביקורת" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* WhatsApp Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              בקשת ביקורת ב-WhatsApp
            </h4>
            <Button
              onClick={() => setOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white mb-2"
            >
              <Phone className="h-4 w-4 mr-2" />
              שלח בקשת ביקורת
            </Button>
            <p className="text-xs text-muted-foreground">
              שלח הודעה אישית ללקוח עם קישור לכתיבת ביקורת
            </p>
          </div>

          {/* Link to Reviews Generator */}
          <div className="border-t pt-3 mt-4">
            <p className="text-xs text-muted-foreground text-center">
              לדרכים מתקדמות יותר לשליחת הזמנות, עבור אל{" "}
              <Link
                href="/business/dashboard/reviews-generator"
                className="text-primary hover:underline font-medium"
              >
                מחולל הביקורות
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              שליחת בקשת ביקורת ב-WhatsApp
            </DialogTitle>
            <DialogDescription>
              הזן את מספר הטלפון של הלקוח ושלח בקשה לביקורת
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Phone number input */}
            <div className="space-y-2">
              <Label htmlFor="phone">מספר טלפון</Label>
              <Input
                id="phone"
                placeholder="054-1234567"
                value={phoneNumber}
                onChange={handlePhoneChange}
                dir="ltr"
                className="text-left"
              />
              <p className="text-xs text-muted-foreground">
                פורמטים נתמכים: 054-1234567, 0541234567, 972541234567
              </p>
            </div>

            {/* Custom message (optional) */}
            <div className="space-y-2">
              <Label htmlFor="message">הודעה מותאמת אישית (אופציונלי)</Label>
              <textarea
                id="message"
                placeholder="השאר ריק להודעה אוטומטית או כתב הודעה מותאמת..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full min-h-[80px] p-2 border border-input rounded-md resize-none text-sm"
              />
            </div>

            {/* Preview */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                👀 תצוגה מקדימה:
              </p>
              <div className="text-xs bg-white p-2 rounded border whitespace-pre-wrap">
                {generateWhatsAppMessage()}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button
              onClick={handleSendWhatsApp}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              שלח ב-WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
