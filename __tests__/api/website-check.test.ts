/**
 * @jest-environment node
 */

import { GET } from "@/app/api/website/check/route";
import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";

// Mock dependencies
jest.mock("@/lib/mongodb");
jest.mock("@/lib/models/Website");

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockWebsite = Website as jest.Mocked<typeof Website>;

describe("/api/website/check", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return website data when website exists", async () => {
      const mockWebsiteData = {
        _id: "website123",
        url: "example.com",
        name: "Test Website",
        categories: ["AI"],
        description: "Test description",
      };

      mockConnectDB.mockResolvedValue(undefined);
      mockWebsite.findOne.mockResolvedValue(mockWebsiteData);

      const request = new NextRequest(
        "http://localhost:3000/api/website/check?url=https://example.com"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockWebsiteData);
      expect(mockWebsite.findOne).toHaveBeenCalledWith({ url: "example.com" });
    });

    it("should return empty object when website does not exist", async () => {
      mockConnectDB.mockResolvedValue(undefined);
      mockWebsite.findOne.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/website/check?url=https://nonexistent.com"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({});
    });

    it("should return 400 when URL parameter is missing", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/website/check"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("URL is required");
    });

    it("should normalize URLs correctly", async () => {
      mockConnectDB.mockResolvedValue(undefined);
      mockWebsite.findOne.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/website/check?url=https://www.Example.com/path"
      );

      await GET(request);

      expect(mockWebsite.findOne).toHaveBeenCalledWith({ url: "example.com" });
    });

    it("should handle database errors gracefully", async () => {
      mockConnectDB.mockRejectedValue(new Error("Database connection failed"));

      const request = new NextRequest(
        "http://localhost:3000/api/website/check?url=https://example.com"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to check website");
    });
  });
});
