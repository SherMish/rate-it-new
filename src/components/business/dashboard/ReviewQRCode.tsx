"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QrCode, Copy, Check, Download } from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";

interface ReviewQRCodeProps {
  websiteUrl: string;
  className?: string;
}

export function ReviewQRCode({ websiteUrl, className }: ReviewQRCodeProps) {
  const [copied, setCopied] = useState(false);

  // Create the review URL
  const reviewUrl = `https://rate-it.co.il/tool/${websiteUrl}/review`;

  const handleCopyImage = async () => {
    try {
      // Get the QR code SVG element
      const qrCodeElement = document.getElementById(`qr-code-${websiteUrl}`);
      if (!qrCodeElement) return;

      // Create a canvas to convert SVG to image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svg = qrCodeElement.querySelector("svg");

      if (!svg || !ctx) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const img = document.createElement("img");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Convert to blob and copy to clipboard
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);
              setCopied(true);
              toast({
                title: "הקוד הועתק!",
                description:
                  "קוד ה-QR הועתק ללוח. ניתן להדביק אותו במקום הרצוי.",
              });
              setTimeout(() => setCopied(false), 2000);
            } catch (err) {
              // Fallback: copy URL to clipboard
              await navigator.clipboard.writeText(reviewUrl);
              toast({
                title: "הקישור הועתק!",
                description: "קישור לכתיבת ביקורת הועתק ללוח.",
              });
            }
          }
        });
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (error) {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(reviewUrl);
      toast({
        title: "הקישור הועתק!",
        description: "קישור לכתיבת ביקורת הועתק ללוח.",
      });
    }
  };

  const handleDownload = () => {
    try {
      const qrCodeElement = document.getElementById(`qr-code-${websiteUrl}`);
      if (!qrCodeElement) return;

      const svg = qrCodeElement.querySelector("svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");

      if (!ctx) return;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Create download link
        const link = document.createElement("a");
        link.download = `rateit-qr-${websiteUrl}.png`;
        link.href = canvas.toDataURL();
        link.click();

        toast({
          title: "הקוד הורד!",
          description: "קוד ה-QR נשמר במכשיר שלך.",
        });
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (error) {
      toast({
        title: "שגיאה בהורדה",
        description: "לא ניתן להוריד את הקוד כרגע.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <QrCode className="h-5 w-5 text-primary" />
          קוד QR לביקורות
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          הציגו את הקוד ללקוחות לכתיבת ביקורת מהירה
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code with logo overlay */}
        <div className="flex justify-center">
          <div
            id={`qr-code-${websiteUrl}`}
            className="relative bg-white p-4 rounded-lg shadow-sm border-2 border-gray-100"
          >
            <QRCode
              value={reviewUrl}
              size={180}
              level="M"
              className="mx-auto"
            />
            {/* Rate-It logo overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-2 shadow-lg border-2 border-primary/20">
                <Image
                  src="/logo_icon.svg"
                  alt="Rate-It"
                  width={24}
                  height={24}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleCopyImage}
            className="flex-1"
            variant="outline"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                הועתק!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                העתק
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            הורד
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
