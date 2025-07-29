"use client";
import { useState, useRef, useEffect } from "react";
import { sendVerificationEmail } from "@/app/actions/verification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface DomainVerificationFormProps {
  websiteUrl: string;
  businessName: string;
  onComplete: () => void;
  onBack: () => void;
}

export function DomainVerificationForm({
  websiteUrl,
  businessName,
  onComplete,
  onBack,
}: DomainVerificationFormProps) {
  const [email, setEmail] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeAttempts, setCodeAttempts] = useState(0);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (showCodeInput) {
      inputRefs.current[0]?.focus();
    }
  }, [showCodeInput]);

  if (!websiteUrl) {
    router.push("/business");
    return;
  }

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

      await sendVerificationEmail(email, websiteUrl, businessName);
      setAttempts((prev) => prev + 1);
      setEmailSent(true);
      setShowCodeInput(true);
    } catch (error) {
      setEmailSent(false);
    }
    setLoading(false);
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length === 6) {
      const newCode = pastedData.split("");
      setVerificationCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) return;

    setVerifyingCode(true);
    try {
      const response = await fetch("/api/business/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        onComplete();
      } else if (data.maxAttemptsExceeded) {
        // Redirect to home page after max attempts
        router.push("/");
      } else {
        setCodeAttempts((prev) => prev + 1);
        if (codeAttempts >= 2) {
          // After 3 attempts, redirect to home
          router.push("/");
        } else {
          // Clear the code for retry
          setVerificationCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      }
    } catch (error) {
      setCodeAttempts((prev) => prev + 1);
      if (codeAttempts >= 2) {
        router.push("/");
      } else {
        setVerificationCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    }
    setVerifyingCode(false);
  };

  const handleResendCode = () => {
    setVerificationCode(["", "", "", "", "", ""]);
    setCodeAttempts(0);
    setEmailSent(false);
    setShowCodeInput(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">אימות בעלות על הדומיין</h2>
        <p className="text-muted-foreground">
          {!showCodeInput
            ? `הזינו את כתובת האימייל העסקית שלכם כדי לאמת בעלות על ${domain}`
            : `הזינו את הקוד בן 6 הספרות שנשלח לכתובת ${email}`}
        </p>
      </div>

      <Card className="p-6">
        {!showCodeInput ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-muted/50 p-4 rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                כתובת האימייל שלכם חייבת להתאים לדומיין של האתר שלכם
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{domain}@</span>
              <Input
                dir="ltr"
                type="text"
                value={email.split("@")[0]}
                onChange={(e) => setEmail(`${e.target.value}@${domain}`)}
                placeholder="example"
                className="flex-1"
                disabled={loading || attempts >= 3}
              />
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleSendVerification}
                className="w-full"
                disabled={loading || attempts >= 3 || !email}
              >
                {loading
                  ? "שולח..."
                  : emailSent
                  ? "שלח שוב"
                  : "שלח אימייל אימות"}
              </Button>

              {attempts > 0 && attempts < 3 && (
                <p className="text-sm text-center text-muted-foreground">
                  נותרו {3 - attempts} ניסיונות
                </p>
              )}

              {attempts >= 3 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    הגעתם למקסימום הניסיונות. אנא צרו קשר עם התמיכה בכתובת{" "}
                    <a
                      href="mailto:hello@rate-it.co.il"
                      className="underline hover:no-underline"
                    >
                      hello@rate-it.co.il
                    </a>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 bg-muted/50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-muted-foreground">
                קוד אימות נשלח לכתובת {email}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                הזינו את הקוד בן 6 הספרות:
              </p>

              <div className="flex justify-center gap-2" dir="ltr">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-mono"
                    disabled={verifyingCode}
                  />
                ))}
              </div>

              <Button
                onClick={handleVerifyCode}
                className="w-full"
                disabled={
                  verifyingCode || verificationCode.join("").length !== 6
                }
              >
                {verifyingCode ? "מאמת..." : "אמת קוד"}
              </Button>

              {codeAttempts > 0 && codeAttempts < 3 && (
                <p className="text-sm text-center text-muted-foreground">
                  נותרו {3 - codeAttempts} ניסיונות
                </p>
              )}

              <div className="flex justify-center gap-4">
                <Button
                  variant="link"
                  onClick={handleResendCode}
                  className="text-sm"
                  disabled={verifyingCode}
                >
                  <ArrowLeft className="h-4 w-4 ml-1" />
                  חזור לשליחת קוד
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {!showCodeInput && (
        <div className="text-center">
          <Button
            variant="link"
            onClick={onBack}
            className="text-sm"
            disabled={loading}
          >
            השתמש בכתובת אימייל אחרת
          </Button>
        </div>
      )}
    </div>
  );
}
