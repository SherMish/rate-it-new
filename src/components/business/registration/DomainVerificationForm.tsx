"use client";
import { useState } from "react";
import { sendVerificationEmail } from "@/app/actions/verification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DomainVerificationFormProps {
  websiteUrl: string;
  onComplete: () => void;
  onBack: () => void;
}

export function DomainVerificationForm({
  websiteUrl,
  onComplete,
  onBack,
}: DomainVerificationFormProps) {
  const [email, setEmail] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const domain = websiteUrl
    .toLowerCase()
    .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "") // Remove protocol and www
    .split("/")[0] // Remove path
    .split(":")[0]; // Remove port if exists

  const handleSendVerification = async () => {
    if (attempts >= 3) {
      return;
    }

    setLoading(true);
    try {
      // Save the work email to localStorage by updating the existing data
      const savedData = JSON.parse(
        localStorage.getItem("businessRegistration") || "{}"
      );
      localStorage.setItem(
        "businessRegistration",
        JSON.stringify({
          ...savedData,
          workEmail: email,
        })
      );

      await sendVerificationEmail(email, websiteUrl);
      setAttempts((prev) => prev + 1);
      setEmailSent(true);
    } catch (error) {
      setEmailSent(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Verify Domain Ownership</h2>
        <p className="text-muted-foreground">
          Enter your work email to verify ownership of {domain}
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-muted/50 p-4 rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your email must match the domain of your website
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={email.split("@")[0]}
              onChange={(e) => setEmail(`${e.target.value}@${domain}`)}
              placeholder="example"
              className="flex-1"
              disabled={loading || attempts >= 3}
            />
            <span className="text-muted-foreground">@{domain}</span>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSendVerification}
              className="w-full"
              disabled={loading || attempts >= 3 || !email}
            >
              {loading
                ? "Sending..."
                : emailSent
                ? "Send Again"
                : "Send Verification Email"}
            </Button>

            {emailSent && (
              <Alert className="bg-success/10 border-success/20 text-success">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Verification email sent! Please check your inbox.
                </AlertDescription>
              </Alert>
            )}

            {attempts > 0 && attempts < 3 && (
              <p className="text-sm text-center text-muted-foreground">
                {3 - attempts} attempts remaining
              </p>
            )}

            {attempts >= 3 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Maximum attempts reached. Please contact support at{" "}
                  <a
                    href="mailto:info@ai-radar.com"
                    className="underline hover:no-underline"
                  >
                    info@ai-radar.com
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Button
          variant="link"
          onClick={onBack}
          className="text-sm"
          disabled={loading}
        >
          Use a different email
        </Button>
      </div>
    </div>
  );
}
