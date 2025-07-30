"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QrCode, Copy, Check, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ReviewQRCodeProps {
  websiteUrl: string;
  className?: string;
}

export function ReviewQRCode({ websiteUrl, className }: ReviewQRCodeProps) {
  const [copied, setCopied] = useState(false);
  const [qrWithLogo, setQrWithLogo] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenQrRef = useRef<HTMLDivElement>(null);

  // Create the review URL
  const reviewUrl = `https://rate-it.co.il/tool/${websiteUrl}/review`;

  // Generate QR code with embedded logo
  useEffect(() => {
    const generateQRWithLogo = async () => {
      if (!hiddenQrRef.current) return;

      // Wait a bit for the QR code to render
      setTimeout(async () => {
        const qrSvg = hiddenQrRef.current?.querySelector("svg");
        if (!qrSvg || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size (higher resolution for better quality)
        canvas.width = 400;
        canvas.height = 400;

        // Convert SVG to image
        const svgData = new XMLSerializer().serializeToString(qrSvg);
        const img = document.createElement("img");

        img.onload = async () => {
          // Draw QR code
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Load and draw logo with high quality
          const logo = document.createElement("img");
          logo.onload = () => {
            // Create white circle background for logo (larger for better visibility)
            const logoSize = 80; // Doubled for higher resolution canvas
            const circleRadius = logoSize / 2 + 8; // Larger padding
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Enable high-quality rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            // Create white circle background with subtle border
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
            ctx.fill();

            // Add subtle border around circle
            ctx.strokeStyle = "#e5e7eb";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw logo with high quality
            ctx.drawImage(
              logo,
              centerX - logoSize / 2,
              centerY - logoSize / 2,
              logoSize,
              logoSize
            );

            // Convert to data URL with high quality
            setQrWithLogo(canvas.toDataURL("image/png", 1.0));
          };

          // Use PNG version if available for better quality, fallback to SVG
          logo.src = "/rate_it_star.png";
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
      }, 100);
    };

    generateQRWithLogo();
  }, [reviewUrl]);

  const handleCopyImage = async () => {
    if (!qrWithLogo) {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(reviewUrl);
      toast({
        title: "הקישור הועתק!",
        description: "קישור לכתיבת ביקורת הועתק ללוח.",
      });
      return;
    }

    try {
      // Convert data URL to blob
      const response = await fetch(qrWithLogo);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      setCopied(true);
      toast({
        title: "הקוד הועתק!",
        description: "קוד ה-QR הועתק ללוח. ניתן להדביק אותו במקום הרצוי.",
      });
      setTimeout(() => setCopied(false), 2000);
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
    if (!qrWithLogo) {
      toast({
        title: "שגיאה בהורדה",
        description: "הקוד עדיין נטען. נסה שוב בעוד רגע.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create download link
      const link = document.createElement("a");
      link.download = `rateit-qr-${websiteUrl}.png`;
      link.href = qrWithLogo;
      link.click();

      toast({
        title: "הקוד הורד!",
        description: "קוד ה-QR נשמר במכשיר שלך.",
      });
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
        {/* Hidden QR Code for processing */}
        <div ref={hiddenQrRef} className="hidden">
          <QRCode value={reviewUrl} size={180} level="M" />
        </div>

        {/* Canvas for generating QR with logo */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Display QR Code with logo */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-100">
            {qrWithLogo ? (
              <img
                src={qrWithLogo}
                alt="QR Code with Rate-It logo"
                className="mx-auto"
                style={{
                  width: 180,
                  height: 180,
                }}
              />
            ) : (
              <div className="w-[180px] h-[180px] flex items-center justify-center bg-gray-100 rounded">
                <span className="text-sm text-gray-500">טוען...</span>
              </div>
            )}
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
