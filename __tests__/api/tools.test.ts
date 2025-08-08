/**
 * @jest-environment node
 */

import { POST } from "@/app/api/tools/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";

// Mock dependencies
jest.mock("next-auth");
jest.mock("@/lib/mongodb");
jest.mock("@/lib/models/Website");

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockWebsite = Website as jest.Mocked<typeof Website>;

describe("/api/tools", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST", () => {
    it("should create a new tool when authenticated with valid data", async () => {
      // Mock authenticated session
      mockGetServerSession.mockResolvedValue({
        user: { id: "user123", email: "test@example.com" },
        expires: "2024-12-31",
      });

      // Mock database operations
      mockConnectDB.mockResolvedValue(undefined);
      mockWebsite.findOne.mockResolvedValue(null); // No existing website
      mockWebsite.create.mockResolvedValue({
        _id: "website123",
        url: "example.com",
        name: "Test Tool",
        categories: ["AI"],
        description: "Test description",
      });

      const request = new NextRequest("http://localhost:3000/api/tools", {
        method: "POST",
        body: JSON.stringify({
          url: "https://example.com",
          name: "Test Tool",
          categories: ["AI"],
          description: "Test description",
          shortDescription: "Short desc",
          logo: "https://example.com/logo.png",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data._id).toBe("website123");
      expect(mockWebsite.create).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "example.com",
          name: "Test Tool",
          categories: ["AI"],
        })
      );
    });

    it("should return 401 when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/tools", {
        method: "POST",
        body: JSON.stringify({
          url: "https://example.com",
          name: "Test Tool",
          categories: ["AI"],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("You must be logged in to create a website");
    });

    it("should return 400 when required fields are missing", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "user123", email: "test@example.com" },
        expires: "2024-12-31",
      });

      const request = new NextRequest("http://localhost:3000/api/tools", {
        method: "POST",
        body: JSON.stringify({
          url: "https://example.com",
          // Missing name and categories
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
    });

    it("should return 400 when website already exists", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "user123", email: "test@example.com" },
        expires: "2024-12-31",
      });

      mockConnectDB.mockResolvedValue(undefined);
      mockWebsite.findOne.mockResolvedValue({ _id: "existing-website" });

      const request = new NextRequest("http://localhost:3000/api/tools", {
        method: "POST",
        body: JSON.stringify({
          url: "https://example.com",
          name: "Test Tool",
          categories: ["AI"],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("This website has already been added");
    });

    it("should validate radar trust score", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "user123", email: "test@example.com" },
        expires: "2024-12-31",
      });

      const request = new NextRequest("http://localhost:3000/api/tools", {
        method: "POST",
        body: JSON.stringify({
          url: "https://example.com",
          name: "Test Tool",
          categories: ["AI"],
          radarTrust: 15, // Invalid score
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("RadarTrust must be a number between 1 and 10");
    });

    it("should normalize URLs correctly", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "user123", email: "test@example.com" },
        expires: "2024-12-31",
      });

      mockConnectDB.mockResolvedValue(undefined);
      mockWebsite.findOne.mockResolvedValue(null);
      mockWebsite.create.mockResolvedValue({
        _id: "website123",
        url: "example.com",
        name: "Test Tool",
      });

      const request = new NextRequest("http://localhost:3000/api/tools", {
        method: "POST",
        body: JSON.stringify({
          url: "https://www.example.com/path",
          name: "Test Tool",
          categories: ["AI"],
        }),
      });

      await POST(request);

      expect(mockWebsite.findOne).toHaveBeenCalledWith({ url: "example.com" });
    });
  });
});
