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
    `We'd love to know what you think of {{toolName}}!

Your insights help others explore trusted AI tools — and support the community in making smarter, faster decisions. `
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
        title: "Name is required",
        description: "Please enter a name for the recipient.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(newRecipientEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    if (
      emailRecipients.some((recipient) => recipient.email === newRecipientEmail)
    ) {
      toast({
        title: "Duplicate email",
        description: "This email has already been added to the list.",
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
          errors.push(`Line ${i + 1}: Missing name or email`);
          continue;
        }

        if (!validateEmail(email)) {
          errors.push(`Line ${i + 1}: Invalid email format - ${email}`);
          continue;
        }

        if (
          emailRecipients.some((r) => r.email === email) ||
          newRecipients.some((r) => r.email === email)
        ) {
          errors.push(`Line ${i + 1}: Duplicate email - ${email}`);
          continue;
        }

        newRecipients.push({ name, email });
      }

      if (errors.length > 0) {
        toast({
          title: `${errors.length} issue(s) found`,
          description: (
            <ul className="max-h-32 overflow-y-auto list-disc pl-4">
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
          title: "CSV Uploaded",
          description: `Added ${newRecipients.length} new recipient(s) to the list`,
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
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>RadarTrust Invitation</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f9f9fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;color:#333;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;padding:24px 24px 20px 24px;">
              <tr>
                <td align="center" style="padding-bottom:16px;">
                  <img src="https://res.cloudinary.com/dwqdhp70e/image/upload/v1742649740/h3eegg5ibuwwufzevlax.png" alt="AI-Radar Logo" width="180" style="display:block;" />
                </td>
              </tr>
              <tr>
                <td style="font-size:17px;font-weight:600;padding-bottom:10px;">
                  Hi {{userName}},
                </td>
              </tr>
              <tr>
                <td style="font-size:15px;line-height:1.6;color:#555;padding-bottom:20px;">
                  We'd love to know what you think of {{toolName}}!
                  <br />
                  <br />
                  Your insights help others explore trusted AI tools — and support the community in making smarter, faster decisions.
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
                    Share Your Experience
                  </a>
                </td>
              </tr>
              <tr>
                <td style="text-align:center;font-size:13px;color:#777;padding-bottom:16px;">
                  Thank you for being a part of the journey.
                </td>
              </tr>
              <tr>
                <td style="text-align:center;font-size:12px;color:#aaa;">
                  Sent via <strong style="color:#888;">AI-Radar</strong>
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
        title: "No recipients",
        description: "Please add at least one recipient to send invitations.",
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
            .replace(/{{toolName}}/g, website?.name || "our tool")
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
                `Failed to send to ${recipient.email}: ${response.statusText}`
              );
            }

            return { success: true, recipient };
          } catch (error) {
            console.error("Error sending invitation:", error);
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
        title: "Invitations Sent",
        description: `Successfully sent ${successful} invitation(s). Failed: ${failed}`,
        variant: successful > 0 ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error in batch sending:", error);
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
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
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reviews Generator</h1>
      <p className="text-muted-foreground mb-8">
        Generate invitations for your users to leave reviews and boost your
        RadarTrust™ score.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Email Invitation Section */}
        <Card className="p-6 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-medium">Email Invitations</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddRecipient}
                  className="w-full mt-1"
                  variant="outline"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <div>
              <Label htmlFor="csvUpload">Upload CSV</Label>
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
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Recipients (CSV)
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>
                        CSV file should have columns: name, email
                        <br />
                        Example: &ldquo;John Doe,john@example.com&rdquo;
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {emailRecipients.length > 0 && (
              <div>
                <Label>Recipients List ({emailRecipients.length})</Label>
                <div className="mt-1 max-h-40 overflow-y-auto border border-border rounded-md">
                  <div className="p-2 space-y-1">
                    {emailRecipients.map((recipient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-secondary/30 rounded px-3 py-1.5 text-sm"
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
                <Label htmlFor="emailTemplate" className="mr-2">
                  Edit Email Body Text
                </Label>
                <span className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded">
                  Coming Soon
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground mb-2">
                Customize your message. Available variables: {"{{userName}}"},{" "}
                {"{{toolName}}"}, {"{{reviewLink}}"}
              </p>
              <Textarea
                id="emailTemplate"
                value={emailBodyText}
                disabled
                readOnly
                className="min-h-[150px] bg-muted/50 cursor-not-allowed"
                placeholder="Enter your message here..."
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
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Sending Invitations...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invitations ({emailRecipients.length})
                  </>
                )}
              </Button>
            </div>

            {sentStatus && (
              <Alert
                variant={sentStatus.failed > 0 ? "destructive" : "default"}
                className="bg-green-900/20"
              >
                <AlertTitle>Invitations Sent</AlertTitle>
                <AlertDescription>
                  Successfully sent {sentStatus.success} of {sentStatus.total}{" "}
                  invitations.
                  {sentStatus.failed > 0 && (
                    <span>
                      {" "}
                      Failed to send {sentStatus.failed} invitation(s).
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>

        <div className="space-y-8">
          {/* Shareable Link Section */}
          <Card className="p-6 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
            <div className="flex items-center mb-4">
              <LinkIcon className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-medium">Shareable Review Link</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              You can also invite users to leave a review by sharing this link
              manually through your own channels.
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
          <Card className="p-6 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08] opacity-70">
            <div className="flex items-center mb-4">
              <Code className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-medium">
                Programmatic Review Invites (API)
              </h2>
              <span className="ml-2 text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded">
                Coming Soon
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Connect your product directly to trigger review invites
              programmatically via our API.
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
