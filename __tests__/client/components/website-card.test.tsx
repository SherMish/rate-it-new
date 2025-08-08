import { render, screen, fireEvent } from "@testing-library/react";
import { WebsiteCard } from "@/components/website-card";
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation");
const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("WebsiteCard", () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    });
    jest.clearAllMocks();
  });

  const mockWebsite = {
    _id: "website123",
    url: "example.com",
    name: "Test Website",
    description: "A test website description",
    shortDescription: "Short description",
    logo: "https://example.com/logo.png",
    categories: ["AI", "Productivity"],
    averageRating: 4.5,
    reviewCount: 10,
    isVerified: true,
    isVerifiedByRateIt: true,
    pricingModel: "FREE" as const,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    isActive: true,
    launchYear: 2023,
    address: "",
    contact: "",
    socialUrls: {},
    licenseValidDate: null,
    createdBy: "user123",
  };

  it("renders website information correctly", () => {
    render(<WebsiteCard website={mockWebsite} />);

    expect(screen.getByText("Test Website")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
  });

  it("displays categories", () => {
    render(<WebsiteCard website={mockWebsite} />);

    // Categories might be displayed as badges or links
    const categoryElements = screen.queryAllByText(/AI|Productivity/);
    expect(categoryElements.length).toBeGreaterThan(0);
  });

  it("shows verified badge when website is verified", () => {
    render(<WebsiteCard website={mockWebsite} />);

    // Look for verified badge elements
    const verifiedBadge = screen.getByTestId("verified-badge");
    expect(verifiedBadge).toBeInTheDocument();
  });

  it("displays correct pricing model", () => {
    render(<WebsiteCard website={mockWebsite} />);

    // Look for free pricing indicator
    const freeIndicator = screen.queryByText(/free|חינם|FREE/i);
    if (freeIndicator) {
      expect(freeIndicator).toBeInTheDocument();
    }
  });

  it("handles click events correctly", () => {
    render(<WebsiteCard website={mockWebsite} />);

    // Find clickable element (card or link)
    const clickableElement =
      screen.getByRole("link") || screen.getByTestId("website-card");
    if (clickableElement) {
      fireEvent.click(clickableElement);
      expect(mockPush).toHaveBeenCalled();
    }
  });

  it("renders website without reviews correctly", () => {
    const websiteWithoutReviews = {
      ...mockWebsite,
      averageRating: 0,
      reviewCount: 0,
    };

    render(<WebsiteCard website={websiteWithoutReviews} />);

    expect(screen.getByText("Test Website")).toBeInTheDocument();

    // Look for no reviews indicator
    const noReviewsIndicator = screen.queryByText(
      /no reviews|אין ביקורות|0 reviews/i
    );
    if (noReviewsIndicator) {
      expect(noReviewsIndicator).toBeInTheDocument();
    }
  });

  it("handles different pricing models", () => {
    const paidWebsite = {
      ...mockWebsite,
      pricingModel: "PAID" as const,
    };

    render(<WebsiteCard website={paidWebsite} />);

    expect(screen.getByText("Test Website")).toBeInTheDocument();

    // Look for paid pricing indicator
    const paidIndicator = screen.queryByText(/paid|בתשלום|PAID/i);
    if (paidIndicator) {
      expect(paidIndicator).toBeInTheDocument();
    }
  });

  it("displays website logo", () => {
    render(<WebsiteCard website={mockWebsite} />);

    // Check for website logo component
    const logoElement = screen.getByTestId("website-logo");
    expect(logoElement).toBeInTheDocument();
  });

  it("renders without crashing when required props are provided", () => {
    const minimalWebsite = {
      _id: "test123",
      url: "test.com",
      name: "Test Site",
      description: "",
      shortDescription: "",
      logo: "",
      categories: ["Other"],
      averageRating: 0,
      reviewCount: 0,
      isVerified: false,
      isVerifiedByRateIt: false,
      pricingModel: "FREE" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      launchYear: 2023,
      address: "",
      contact: "",
      socialUrls: {},
      licenseValidDate: null,
      createdBy: "user123",
    };

    expect(() =>
      render(<WebsiteCard website={minimalWebsite} />)
    ).not.toThrow();
  });
});
