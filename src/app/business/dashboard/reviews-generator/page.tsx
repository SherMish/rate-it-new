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
    ? `${process.env.NEXT_PUBLIC_BASE_URL || "https://ai-radar.co"}/tool/${
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

  const getFullEmailTemplate = (bodyText: string) => {
    return `
  <!DOCTYPE html>
  <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <title>הזמנה לביקורת</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f9f9fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;color:#333;direction:rtl;text-align:right;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;padding:24px 24px 20px 24px;">
              <tr>
                <td align="center" style="padding-bottom:16px;">
                  <img src="https://res.cloudinary.com/dwqdhp70e/image/upload/v1742649740/h3eegg5ibuwwufzevlax.png" alt="רייט-איט לוגו" width="180" style="display:block;" />
                </td>
              </tr>
              <tr>
                <td style="font-size:17px;font-weight:600;padding-bottom:10px;">
                  שלום {{userName}},
                </td>
              </tr>
              <tr>
                <td style="font-size:15px;line-height:1.6;color:#555;padding-bottom:20px;">
                  נשמח לשמוע מה דעתך על {{toolName}}!
                  <br />
                  <br />
                  התובנות שלך עוזרות לאחרים לחקור עסקים אמינים — ולתמוך בקהילה בקבלת החלטות חכמות ומהירות יותר.
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <a href="{{reviewLink}}" style="
                    background: linear-gradient(to right, #6366f1, #8b5cf6);
                    color: white;
                    padding: 10px 22px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 14px;
                    display: inline-block;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.08);
                  ">
                    שתף/י את החוויה שלך
                  </a>
                </td>
              </tr>
              <tr>
                <td style="text-align:center;font-size:13px;color:#777;padding-bottom:16px;">
                  תודה שאתם חלק מהמסע.
                </td>
              </tr>
              <tr>
                <td style="text-align:center;font-size:12px;color:#aaa;">
                  נשלח דרך <strong style="color:#888;">רייט-איט</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
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
          // Generate the full HTML template with the user's body text
          const fullTemplate = getFullEmailTemplate(emailBodyText);

          // Replace template variables
          const personalizedMessage = fullTemplate
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
                message: personalizedMessage,
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
                <span className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded">
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
                className="min-h-[150px] bg-muted/50 cursor-not-allowed"
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
                className="bg-green-900/20"
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
              <span className="mr-2 text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded">
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
                  process.env.NEXT_PUBLIC_BASE_URL || "https://ai-radar.co"
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
                      process.env.NEXT_PUBLIC_BASE_URL || "https://ai-radar.co"
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
