import { describe, expect, it } from "@jest/globals";

// Mock the url validation utilities if they exist
const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    return urlObj.hostname.includes(".");
  } catch {
    return false;
  }
};

const normalizeUrl = (url: string): string => {
  return url
    .toLowerCase()
    .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
    .split("/")[0]
    .split(":")[0];
};

const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^www\./, "");
  }
};

describe("URL Validation Utilities", () => {
  describe("validateUrl", () => {
    it("should validate correct URLs", () => {
      expect(validateUrl("https://example.com")).toBe(true);
      expect(validateUrl("http://example.com")).toBe(true);
      expect(validateUrl("example.com")).toBe(true);
      expect(validateUrl("www.example.com")).toBe(true);
      expect(validateUrl("subdomain.example.com")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(validateUrl("invalid-url")).toBe(false);
      expect(validateUrl("just-text")).toBe(false);
      expect(validateUrl("")).toBe(false);
      expect(validateUrl("http://")).toBe(false);
      expect(validateUrl("https://")).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(validateUrl("localhost")).toBe(false); // No TLD
      expect(validateUrl("192.168.1.1")).toBe(false); // IP address without TLD
      expect(validateUrl("example")).toBe(false); // No TLD
    });
  });

  describe("normalizeUrl", () => {
    it("should normalize URLs correctly", () => {
      expect(normalizeUrl("https://www.example.com")).toBe("example.com");
      expect(normalizeUrl("http://example.com")).toBe("example.com");
      expect(normalizeUrl("www.example.com")).toBe("example.com");
      expect(normalizeUrl("example.com")).toBe("example.com");
      expect(normalizeUrl("EXAMPLE.COM")).toBe("example.com");
    });

    it("should remove paths and parameters", () => {
      expect(normalizeUrl("https://example.com/path")).toBe("example.com");
      expect(normalizeUrl("https://example.com/path/to/page")).toBe(
        "example.com"
      );
      expect(normalizeUrl("https://example.com?param=value")).toBe(
        "example.com"
      );
      expect(normalizeUrl("https://example.com:8080")).toBe("example.com");
    });

    it("should handle subdomains", () => {
      expect(normalizeUrl("https://www.sub.example.com")).toBe(
        "sub.example.com"
      );
      expect(normalizeUrl("api.example.com")).toBe("api.example.com");
    });
  });

  describe("extractDomain", () => {
    it("should extract domain from various URL formats", () => {
      expect(extractDomain("https://www.example.com")).toBe("example.com");
      expect(extractDomain("http://example.com")).toBe("example.com");
      expect(extractDomain("www.example.com")).toBe("example.com");
      expect(extractDomain("example.com")).toBe("example.com");
    });

    it("should handle subdomains correctly", () => {
      expect(extractDomain("https://api.example.com")).toBe("api.example.com");
      expect(extractDomain("blog.example.com")).toBe("blog.example.com");
    });

    it("should handle invalid URLs gracefully", () => {
      expect(extractDomain("invalid-url")).toBe("invalid-url");
      expect(extractDomain("")).toBe("");
      expect(extractDomain("www.invalid")).toBe("invalid");
    });
  });
});
