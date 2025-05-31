import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";

const socialIconColors = {
  facebook: "text-indigo-600 hover:text-indigo-700",
  instagram: "text-pink-600 hover:text-pink-700",
  twitter: "text-blue-500 hover:text-blue-600",
  tiktok: "text-black hover:text-black",
  linkedin: "text-blue-700 hover:text-blue-800",
  youtube: "text-red-600 hover:text-red-700",
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
    linkedin?: string;
    youtube?: string;
  };
}) => {
  return (
    Object.values(socialUrls).some((url) => url) && (
      <div className="p-4 rounded-lg border border-border bg-background/50">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
          רשתות חברתיות
        </h3>
        <div className="flex items-center justify-center flex-wrap gap-3">
          {socialUrls.facebook && (
            <a
              href={ensureFullUrl(socialUrls.facebook)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors shadow-sm"
              aria-label="Facebook"
            >
              <Facebook className={`w-5 h-5 ${socialIconColors.facebook}`} />
            </a>
          )}
          {socialUrls.instagram && (
            <a
              href={ensureFullUrl(socialUrls.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors shadow-sm"
              aria-label="Instagram"
            >
              <Instagram className={`w-5 h-5 ${socialIconColors.instagram}`} />
            </a>
          )}
          {socialUrls.twitter && (
            <a
              href={ensureFullUrl(socialUrls.twitter)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors shadow-sm"
              aria-label="Twitter"
            >
              <Twitter className={`w-5 h-5 ${socialIconColors.twitter}`} />
            </a>
          )}
          {socialUrls.tiktok && (
            <a
              href={ensureFullUrl(socialUrls.tiktok)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors shadow-sm"
              aria-label="TikTok"
            >
              <FaTiktok className={`w-5 h-5 ${socialIconColors.tiktok}`} />
            </a>
          )}
          {socialUrls.linkedin && (
            <a
              href={ensureFullUrl(socialUrls.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin className={`w-5 h-5 ${socialIconColors.linkedin}`} />
            </a>
          )}
          {socialUrls.youtube && (
            <a
              href={ensureFullUrl(socialUrls.youtube)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-background/80 transition-colors shadow-sm"
              aria-label="YouTube"
            >
              <Youtube className={`w-5 h-5 ${socialIconColors.youtube}`} />
            </a>
          )}
        </div>
      </div>
    )
  );
};

export default SocialMediaSection;
