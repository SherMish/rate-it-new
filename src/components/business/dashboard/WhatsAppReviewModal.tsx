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
import { MessageSquare, Send, Phone } from "lucide-react";
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

  const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tool/${websiteUrl}/review`;

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
    const whatsappUrl = `https://wa.me/${formattedPhone.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;

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

  return (
    <>
      <Card
        className={`hover:shadow-lg transition-all cursor-pointer ${className}`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-green-600" />
            בקשת ביקורת ב-WhatsApp
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            שלח בקשה לביקורת ישירות ללקוחות ב-WhatsApp
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setOpen(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Phone className="h-4 w-4 mr-2" />
            שלח בקשת ביקורת
          </Button>

          {/* Usage tip */}
          <div className="text-xs text-muted-foreground mt-3 space-y-1">
            <p className="font-medium">💡 מתי לשלוח:</p>
            <ul className="list-disc list-inside space-y-0.5 mr-2">
              <li>לאחר מתן שירות טוב</li>
              <li>כשהלקוח מרוצה</li>
              <li>במהלך או בסיום העבודה</li>
            </ul>
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
