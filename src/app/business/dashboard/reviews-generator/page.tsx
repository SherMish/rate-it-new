"use client";

import { useState, useRef } from "react";
import {
  Mail,
  Upload,
  Copy,
  Check,
  Link as LinkIcon,
  Code,
  AlertCircle,
  Send,
  X,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  wrapEmailContent,
  getPlainTextFooter,
  emailStyles,
} from "@/lib/email-templates";

interface EmailRecipient {
  name: string;
  email: string;
}

export default function ReviewsGeneratorPage() {
  const { isLoading, website, user } = useBusinessGuard();
  const { toast } = useToast();
  const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [emailBodyText, setEmailBodyText] = useState(
    `נשמח לשמוע מה דעתכם על {{toolName}}!

התובנות שלכם עוזרות לאחרים לחקור עסקים אמינים — ולתמוך בקהילה בקבלת החלטות חכמות ומהירות יותר.`
  );
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const [copyApiSuccess, setCopyApiSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reviewLink = website
    ? `${process.env.NEXT_PUBLIC_BASE_URL || "https://rate-it.co.il"}/tool/${
        website.url
      }/review`
    : "";

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddRecipient = () => {
    if (!newRecipientName.trim()) {
      toast({
        title: "נדרש שם",
        description: "אנא הזן שם עבור הנמען.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(newRecipientEmail)) {
      toast({
        title: "כתובת אימייל לא תקינה",
        description: "אנא הזן כתובת אימייל תקינה.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    if (
      emailRecipients.some((recipient) => recipient.email === newRecipientEmail)
    ) {
      toast({
        title: "כתובת אימייל כפולה",
        description: "כתובת האימייל הזו כבר נוספה לרשימה.",
        variant: "destructive",
      });
      return;
    }

    setEmailRecipients([
      ...emailRecipients,
      { name: newRecipientName, email: newRecipientEmail },
    ]);
    setNewRecipientName("");
    setNewRecipientEmail("");
  };

  const handleRemoveRecipient = (email: string) => {
    setEmailRecipients(
      emailRecipients.filter((recipient) => recipient.email !== email)
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split("\n");

      // Skip header row if it exists
      const startIndex = lines[0].toLowerCase().includes("name,email") ? 1 : 0;

      const newRecipients: EmailRecipient[] = [];
      const errors: string[] = [];

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [name, email] = line.split(",").map((item) => item.trim());

        if (!name || !email) {
          errors.push(`שורה ${i + 1}: חסר שם או אימייל`);
          continue;
        }

        if (!validateEmail(email)) {
          errors.push(`שורה ${i + 1}: פורמט אימייל לא תקין - ${email}`);
          continue;
        }

        if (
          emailRecipients.some((r) => r.email === email) ||
          newRecipients.some((r) => r.email === email)
        ) {
          errors.push(`שורה ${i + 1}: כתובת אימייל כפולה - ${email}`);
          continue;
        }

        newRecipients.push({ name, email });
      }

      if (errors.length > 0) {
        toast({
          title: `נמצאו ${errors.length} בעיות`,
          description: (
            <ul className="max-h-32 overflow-y-auto list-disc pr-4">
              {errors.map((error, index) => (
                <li key={index} className="text-xs">
                  {error}
                </li>
              ))}
            </ul>
          ),
          variant: "destructive",
        });
      }

      if (newRecipients.length > 0) {
        setEmailRecipients([...emailRecipients, ...newRecipients]);
        toast({
          title: "קובץ CSV הועלה",
          description: `נוספו ${newRecipients.length} נמענים חדשים לרשימה`,
        });
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getMessageTemplate = () => {
    return `שלום {{userName}},

נשמח לשמוע מה דעתך על {{toolName}}!

התובנות שלך עוזרות לאחרים לגלות עסקים אמינים ולקבל החלטות חכמות יותר.

לשיתוף החוויה שלך:
{{reviewLink}}

תודה שאתה חלק מהקהילה שלנו!${getPlainTextFooter()}`;
  };

  const getFullEmailTemplate = (bodyText: string) => {
    const content = `
    <!-- Logo Header -->
    <tr>
        <td align="center" style="padding:0 0 30px 0;">
            <img src="https://rate-it.co.il/logo_new.png" alt="Rate-It" width="300" height="150" style="${emailStyles.logo}">
        </td>
    </tr>
    
    <!-- Main Content Card -->
    <tr>
        <td style="${emailStyles.card}">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <!-- Content -->
                <tr>
                    <td style="padding:40px 40px 30px 40px;direction:rtl;text-align:right;">
                        <h1 style="${emailStyles.heading}">
                            שלום {{userName}},
                        </h1>
                        
                        <p style="${emailStyles.paragraph}">
                            נשמח לשמוע מה דעתך על <strong style="color:#111827;">{{toolName}}</strong>!
                        </p>
                        
                        <p style="margin:0 0 32px 0;font-size:16px;line-height:1.6;color:#4b5563;">
                            התובנות שלך עוזרות לאחרים לגלות עסקים אמינים ולקבל החלטות חכמות יותר.
                        </p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                                <td align="center" style="padding:0 0 24px 0;">
                                    <a href="{{reviewLink}}" target="_blank" style="${emailStyles.button}">
                                        שתף את החוויה שלך
                                    </a>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="margin:0;font-size:14px;line-height:1.5;color:#6b7280;text-align:center;">
                            תודה שאתה חלק מהקהילה שלנו!
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>`;

    return wrapEmailContent(
      content,
      "נשמח לשמוע את דעתך על {{toolName}} - שתף את החוויה שלך"
    );
  };

  const handleSendInvitations = async () => {
    if (emailRecipients.length === 0) {
      toast({
        title: "אין נמענים",
        description: "אנא הוסף לפחות נמען אחד כדי לשלוח הזמנות.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setSentStatus(null);

    try {
      const results = await Promise.all(
        emailRecipients.map(async (recipient) => {
          // Generate both HTML and plain text versions
          const fullHtmlTemplate = getFullEmailTemplate(emailBodyText);
          const plainTextTemplate = getMessageTemplate();

          // Replace template variables in both versions
          const personalizedHtmlMessage = fullHtmlTemplate
            .replace(/{{userName}}/g, recipient.name)
            .replace(/{{toolName}}/g, website?.name || "העסק שלנו")
            .replace(/{{reviewLink}}/g, reviewLink);

          const personalizedTextMessage = plainTextTemplate
            .replace(/{{userName}}/g, recipient.name)
            .replace(/{{toolName}}/g, website?.name || "העסק שלנו")
            .replace(/{{reviewLink}}/g, reviewLink);

          try {
            const response = await fetch("/api/send-review-invitation", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: recipient.email,
                name: recipient.name,
                websiteId: website?._id,
                html: personalizedHtmlMessage,
                message: personalizedTextMessage,
              }),
            });

            if (!response.ok) {
              throw new Error(
                `נכשל בשליחה ל-${recipient.email}: ${response.statusText}`
              );
            }

            return { success: true, recipient };
          } catch (error) {
            console.error("שגיאה בשליחת הזמנה:", error);
            return { success: false, recipient };
          }
        })
      );

      const successful = results.filter((r) => r.success).length;
      const failed = results.length - successful;

      setSentStatus({
        total: results.length,
        success: successful,
        failed: failed,
      });

      // Clear recipients that were successfully sent
      if (successful > 0) {
        const failedEmails = results
          .filter((r) => !r.success)
          .map((r) => r.recipient.email);

        if (failedEmails.length > 0) {
          setEmailRecipients(
            emailRecipients.filter((r) => failedEmails.includes(r.email))
          );
        } else {
          setEmailRecipients([]);
        }
      }

      toast({
        title: "הזמנות נשלחו",
        description: `נשלחו בהצלחה ${successful} הזמנות. נכשלו: ${failed}`,
        variant: successful > 0 ? "default" : "destructive",
      });
    } catch (error) {
      console.error("שגיאה בשליחה קבוצתית:", error);
      toast({
        title: "שגיאה",
        description: "שליחת ההזמנות נכשלה. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = async (
    text: string,
    successStateUpdater: (value: boolean) => void
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      successStateUpdater(true);
      setTimeout(() => successStateUpdater(false), 2000);
    } catch (err) {
      toast({
        title: "העתקה נכשלה",
        description: "אנא נסה שוב או העתק באופן ידני",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">יצירת ביקורות</h1>
      <p className="text-muted-foreground mb-8">
        צור הזמנות למשתמשים שלך להשאיר ביקורות ולשפר את ציון האמון שלך.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Email Invitation Section */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 text-primary ml-2" />
            <h2 className="text-lg font-medium">הזמנות באימייל</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <Label htmlFor="recipientName">שם הנמען</Label>
                <Input
                  id="recipientName"
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  placeholder="ישראל ישראלי"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="recipientEmail">אימייל הנמען</Label>
                <Input
                  id="recipientEmail"
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  placeholder="israel@example.com"
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddRecipient}
                  className="w-full mt-1"
                  variant="outline"
                >
                  הוסף
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground">או</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <div>
              <Label htmlFor="csvUpload">העלאת CSV</Label>
              <div className="mt-1 flex items-center gap-3">
                <Input
                  ref={fileInputRef}
                  id="csvUpload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 ml-2" />
                  העלאת נמענים (CSV)
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]" dir="rtl">
                      <p>
                        קובץ CSV צריך להכיל עמודות: שם, אימייל
                        <br />
                        דוגמה: &rdquo;ישראל ישראלי,israel@example.com&ldquo;
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {emailRecipients.length > 0 && (
              <div>
                <Label>רשימת נמענים ({emailRecipients.length})</Label>
                <div className="mt-1 max-h-40 overflow-y-auto border border-border rounded-md">
                  <div className="p-2 space-y-1">
                    {emailRecipients.map((recipient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-accent/50 rounded px-3 py-1.5 text-sm"
                      >
                        <div className="truncate">
                          <span className="font-medium">{recipient.name}</span>{" "}
                          <span className="text-muted-foreground">
                            ({recipient.email})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveRecipient(recipient.email)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="opacity-70 pointer-events-none">
              <div className="flex items-center mb-2">
                <Label htmlFor="emailTemplate" className="ml-2">
                  עריכת תוכן האימייל
                </Label>
                <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded border border-yellow-200">
                  בקרוב
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground mb-2">
                התאם אישית את ההודעה שלך. משתנים זמינים: {"{{userName}}"},{" "}
                {"{{toolName}}"}, {"{{reviewLink}}"}
              </p>
              <Textarea
                id="emailTemplate"
                value={emailBodyText}
                disabled
                readOnly
                className="min-h-[150px] bg-muted/30 cursor-not-allowed border-muted"
                placeholder="הזן את ההודעה שלך כאן..."
              />
            </div>

            <div>
              <Button
                onClick={handleSendInvitations}
                disabled={emailRecipients.length === 0 || isSending}
                className="w-full flex items-center justify-center"
              >
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin ml-2 h-4 w-4" />
                    שולח הזמנות...
                  </>
                ) : (
                  <>
                    <Send className="ml-2 h-4 w-4" />
                    שלח הזמנות ({emailRecipients.length})
                  </>
                )}
              </Button>
            </div>

            {sentStatus && (
              <Alert
                variant={sentStatus.failed > 0 ? "destructive" : "default"}
                className="bg-green-50"
              >
                <AlertTitle>הזמנות נשלחו</AlertTitle>
                <AlertDescription>
                  נשלחו בהצלחה {sentStatus.success} מתוך {sentStatus.total}{" "}
                  הזמנות.
                  {sentStatus.failed > 0 && (
                    <span> נכשלו בשליחה {sentStatus.failed} הזמנות.</span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>

        <div className="space-y-8">
          {/* Shareable Link Section */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <LinkIcon className="w-5 h-5 text-primary ml-2" />
              <h2 className="text-lg font-medium">קישור לשיתוף ביקורת</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              ניתן גם להזמין משתמשים להשאיר ביקורת על ידי שיתוף הקישור הזה באופן
              ידני דרך הערוצים שלך.
            </p>

            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={reviewLink}
                className="font-mono text-sm"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(reviewLink, setCopyLinkSuccess)}
              >
                {copyLinkSuccess ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>

          {/* API Integration Section (Coming Soon) */}
          <Card className="p-6 opacity-70">
            <div className="flex items-center mb-4">
              <Code className="w-5 h-5 text-primary ml-2" />
              <h2 className="text-lg font-medium">
                הזמנות ביקורת תכנותיות (API)
              </h2>
              <span className="mr-2 text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded border border-yellow-200">
                בקרוב
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              חבר את המוצר שלך ישירות כדי להפעיל הזמנות ביקורת באופן תכנותי
              באמצעות ה-API שלנו.
            </p>

            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={`${
                  process.env.NEXT_PUBLIC_BASE_URL || "https://rate-it.co.il"
                }/api/invite-review`}
                className="font-mono text-sm"
                disabled
              />
              <Button
                size="icon"
                variant="outline"
                disabled
                onClick={() =>
                  copyToClipboard(
                    `${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://rate-it.co.il"
                    }/api/invite-review`,
                    setCopyApiSuccess
                  )
                }
              >
                {copyApiSuccess ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
