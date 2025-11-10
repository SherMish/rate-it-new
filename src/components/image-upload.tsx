"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setIsLoading(true);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[100px] h-[100px] rounded-lg border border-border overflow-hidden bg-secondary">
        {value ? (
          <>
            <Image
              fill
              src={value}
              alt="Logo"
              className="object-contain"
            />
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              type="button"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 max-w-[200px]">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Recommended: Square logo, max 1MB
        </p>
      </div>
    </div>
  );
} 