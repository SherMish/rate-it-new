/**
 * Sanitizes a URL to extract just the domain name
 * Example: https://www.example.com/route/more-route?urlparam=x&moreparam=4 -> example.com
 */
export function sanitizeUrl(input: string): string {
  try {
    // Remove leading/trailing whitespace
    const trimmed = input.trim();

    // If empty, return as is
    if (!trimmed) return trimmed;

    // Add https:// if no protocol is present
    const urlWithProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    // Parse the URL
    const url = new URL(urlWithProtocol);

    // Extract hostname and remove www. prefix
    let hostname = url.hostname.toLowerCase();
    if (hostname.startsWith("www.")) {
      hostname = hostname.substring(4);
    }

    return hostname;
  } catch (error) {
    // If URL parsing fails, return the original input
    return input;
  }
}

/**
 * Validates if a string is a valid URL or domain
 */
export function isValidUrl(input: string): boolean {
  try {
    const trimmed = input.trim();

    // Check if it's empty
    if (!trimmed) return false;

    // Block email addresses (contains @)
    if (trimmed.includes("@")) return false;

    // Block if it starts with invalid characters
    if (
      trimmed.startsWith(".") ||
      trimmed.startsWith("-") ||
      trimmed.endsWith(".") ||
      trimmed.endsWith("-")
    ) {
      return false;
    }

    // Add https:// if no protocol is present
    const urlWithProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    // Try to parse as URL
    const url = new URL(urlWithProtocol);

    // Check if hostname is valid (has at least one dot and valid characters)
    const hostname = url.hostname.toLowerCase();

    // Block localhost and IP addresses
    if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return false;
    }

    // Enhanced domain validation
    const domainRegex =
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

    // Must have at least one dot and be a valid domain format
    const isValidDomain = domainRegex.test(hostname) && hostname.includes(".");

    // Must have a valid TLD (at least 2 characters after the last dot)
    const parts = hostname.split(".");
    const tld = parts[parts.length - 1];
    const hasValidTld = tld.length >= 2 && /^[a-z]+$/.test(tld);

    return isValidDomain && hasValidTld;
  } catch (error) {
    return false;
  }
}

/**
 * Gets a user-friendly error message for invalid URLs
 */
export function getUrlErrorMessage(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) {
    return "כתובת האתר נדרשת";
  }

  if (trimmed.includes("@")) {
    return "אנא הזינו כתובת אתר ולא כתובת אימייל";
  }

  if (!trimmed.includes(".")) {
    return "כתובת האתר חייבת לכלול נקודה (לדוגמה: example.com)";
  }

  if (trimmed.includes(" ")) {
    return "כתובת האתר לא יכולה לכלול רווחים";
  }

  if (
    trimmed.startsWith(".") ||
    trimmed.startsWith("-") ||
    trimmed.endsWith(".") ||
    trimmed.endsWith("-")
  ) {
    return "כתובת האתר לא יכולה להתחיל או להסתיים בנקודה או מקף";
  }

  // Check for valid TLD
  const parts = trimmed.split(".");
  const tld = parts[parts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/i.test(tld)) {
    return "כתובת האתר חייבת להכיל סיומת תקינה (לדוגמה: .com, .co.il)";
  }

  return "אנא הזינו כתובת אתר תקינה (לדוגמה: example.com)";
}
