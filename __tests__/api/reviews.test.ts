/**
 * @jest-environment node
 */

import { GET } from "@/app/api/reviews/get/route";
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
          _id: { toString: () => "review1" },
          title: "Great tool!",
          body: "Amazing functionality",
          rating: 5,
          createdAt: new Date("2023-01-01"),
          helpfulCount: 5,
          relatedUser: { name: "Test User" },
          isVerified: true,
        },
        {
          _id: { toString: () => "review2" },
          title: "Good but could be better",
          body: "Nice features but needs improvement",
          rating: 4,
          createdAt: new Date("2023-01-02"),
          helpfulCount: 2,
          relatedUser: { name: "Another User" },
          isVerified: false,
        },
      ];

      mockConnectDB.mockResolvedValue(undefined);

      // Mock the Review.find chain
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockReviews),
      };
      mockReview.find.mockReturnValue(mockQuery as any);

      const url = "http://localhost:3000/api/reviews/get?websiteId=website123";
      const request = new Request(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].title).toBe("Great tool!");
      expect(data[1].rating).toBe(4);
      expect(mockReview.find).toHaveBeenCalledWith({
        relatedWebsite: "website123",
      });
    });

    it("should return empty array when no reviews exist", async () => {
      mockConnectDB.mockResolvedValue(undefined);

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };
      mockReview.find.mockReturnValue(mockQuery as any);

      const url = "http://localhost:3000/api/reviews/get?websiteId=nonexistent";
      const request = new Request(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(0);
    });

    it("should return 400 when websiteId is missing", async () => {
      const url = "http://localhost:3000/api/reviews/get";
      const request = new Request(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing websiteId");
    });

    it("should handle database errors gracefully", async () => {
      mockConnectDB.mockRejectedValue(new Error("Database connection failed"));

      const url = "http://localhost:3000/api/reviews/get?websiteId=website123";
      const request = new Request(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch reviews");
    });

    it("should format review data correctly", async () => {
      const mockReview = {
        _id: { toString: () => "review123" },
        title: "Test Review",
        body: "Test body",
        rating: 5,
        createdAt: new Date("2023-01-01T10:00:00Z"),
        helpfulCount: 3,
        relatedUser: { name: "Test User" },
        isVerified: true,
        businessResponse: {
          text: "Thank you!",
          lastUpdated: new Date("2023-01-02T10:00:00Z"),
        },
      };

      mockConnectDB.mockResolvedValue(undefined);

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockReview]),
      };
      mockReview.find.mockReturnValue(mockQuery as any);

      const url = "http://localhost:3000/api/reviews/get?websiteId=website123";
      const request = new Request(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data[0]).toEqual({
        _id: "review123",
        title: "Test Review",
        body: "Test body",
        rating: 5,
        helpfulCount: 3,
        createdAt: "2023-01-01T10:00:00.000Z",
        relatedUser: { name: "Test User" },
        isVerified: true,
        businessResponse: {
          text: "Thank you!",
          lastUpdated: "2023-01-02T10:00:00.000Z",
        },
      });
    });
  });
});
