import { Facebook, Instagram, Twitter } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";

const socialIconColors = {
  facebook: "text-indigo-600 hover:text-indigo-700",
  instagram: "text-pink-600 hover:text-pink-700",
  twitter: "text-blue-500 hover:text-blue-600",
  tiktok: "text-black hover:text-black", //change to black
};

// Helper function to ensure URL has protocol
const ensureFullUrl = (url: string): string => {
  if (!url) return "";
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
};

export const SocialMediaSection = ({
  socialUrls,
}: {
  socialUrls: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
}) => {
  return (
    Object.values(socialUrls).some((url) => url) && (
      <div className="p-3 rounded-lg border border-border bg-background/50">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-1">
            רשתות חברתיות:
          </span>
          {socialUrls.facebook && (
            <a
              href={ensureFullUrl(socialUrls.facebook)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className={`w-4 h-4 ${socialIconColors.facebook}`} />
            </a>
          )}
          {socialUrls.instagram && (
            <a
              href={ensureFullUrl(socialUrls.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className={`w-4 h-4 ${socialIconColors.instagram}`} />
            </a>
          )}
          {socialUrls.twitter && (
            <a
              href={ensureFullUrl(socialUrls.twitter)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className={`w-4 h-4 ${socialIconColors.twitter}`} />
            </a>
          )}
          {socialUrls.tiktok && (
            <a
              href={ensureFullUrl(socialUrls.tiktok)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok className={`w-4 h-4 ${socialIconColors.tiktok}`} />
            </a>
          )}
        </div>
      </div>
    )
  );
};

export default SocialMediaSection;
