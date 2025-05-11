"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface UploadImageProps {
  onUpload: (url: string) => void;
  onClear: () => void;
  uploadedUrl?: string;
}

export function UploadImage({ onUpload, onClear, uploadedUrl }: UploadImageProps) {
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleUpload = () => {
    // @ts-ignore
    const widget = window.cloudinary?.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onUpload(result.info.secure_url);
        }
      }
    );

    widget.open();
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={handleUpload}
      >
        <ImagePlus className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Logo"}
      </Button>
      
      {uploadedUrl && (
        <div className="relative">
          <Image
            src={uploadedUrl}
            alt="Uploaded logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <button
            onClick={onClear}
            className="absolute -top-2 -right-2 bg-background rounded-full p-1 border"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
} 