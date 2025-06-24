import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[|\/\\:*?"<>]/g, "") // Remove special chars like |, /, \, :, *, ?, ", <, >
    .replace(/[^\u0590-\u05FF\u0020-\u007F\w\-]/g, "") // Keep Hebrew chars, ASCII, word chars, and hyphens
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString("hex");
}
