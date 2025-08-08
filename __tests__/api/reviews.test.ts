/**
 * @jest-environment node
 */

import { GET } from "@/app/api/reviews/get/route";
import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";

// Mock dependencies
jest.mock("@/lib/mongodb");
jest.mock("@/lib/models/Review");

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockReview = Review as jest.Mocked<typeof Review>;

describe("/api/reviews/get", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return reviews for a specific website", async () => {
      const mockReviews = [
        {
          _id: "review1",
          body: "Great tool!",
          rating: 5,
          relatedWebsite: {
            _id: "website123",
            name: "Test Website",
            url: "example.com",
          },
          relatedUser: {
            _id: "user123",
            name: "Test User",
          },
          createdAt: new Date("2023-01-01"),
        },
        {
          _id: "review2",
          body: "Good but could be better",
          rating: 4,
          relatedWebsite: {
            _id: "website123",
            name: "Test Website",
            url: "example.com",
          },
          relatedUser: {
            _id: "user456",
            name: "Another User",
          },
          createdAt: new Date("2023-01-02"),
        },
      ];

      mockConnectDB.mockResolvedValue(undefined);
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockReviews),
          }),
        }),
      } as any);

      const request = new NextRequest(
        "http://localhost:3000/api/reviews/get?websiteId=website123"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].body).toBe("Great tool!");
      expect(data[1].rating).toBe(4);
    });

    it("should return empty array when no reviews exist", async () => {
      mockConnectDB.mockResolvedValue(undefined);
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const request = new NextRequest(
        "http://localhost:3000/api/reviews/get?websiteId=nonexistent"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(0);
    });

    it("should handle database errors gracefully", async () => {
      mockConnectDB.mockRejectedValue(new Error("Database connection failed"));

      const request = new NextRequest(
        "http://localhost:3000/api/reviews/get?websiteId=website123"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch reviews");
    });

    it("should filter by rating when specified", async () => {
      const mockFilteredReviews = [
        {
          _id: "review1",
          body: "Excellent!",
          rating: 5,
          relatedWebsite: { _id: "website123", name: "Test Website" },
          createdAt: new Date(),
        },
      ];

      mockConnectDB.mockResolvedValue(undefined);
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockFilteredReviews),
          }),
        }),
      } as any);

      const request = new NextRequest(
        "http://localhost:3000/api/reviews/get?websiteId=website123&rating=5"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].rating).toBe(5);
    });

    it("should limit results when limit parameter is provided", async () => {
      const mockLimitedReviews = [
        {
          _id: "review1",
          body: "Review 1",
          rating: 5,
          relatedWebsite: { _id: "website123", name: "Test Website" },
          createdAt: new Date(),
        },
      ];

      mockConnectDB.mockResolvedValue(undefined);
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue(mockLimitedReviews),
            }),
          }),
        }),
      } as any);

      const request = new NextRequest(
        "http://localhost:3000/api/reviews/get?websiteId=website123&limit=1"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
    });
  });
});
