import { render, screen, fireEvent } from "@testing-library/react";
import { WebsiteCard } from "@/components/website-card";
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation");
const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

// Mock the SuggestedToolCard component since it might have complex dependencies
jest.mock("@/components/suggested-tool-card", () => ({
  SuggestedToolCard: ({ website }: any) => (
    <div data-testid="suggested-tool-card">{website.name}</div>
  ),
}));

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
  };

  it("renders website information correctly", () => {
    render(<WebsiteCard website={mockWebsite} />);

    expect(screen.getByText("Test Website")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("Productivity")).toBeInTheDocument();
  });

  it("displays rating and review count", () => {
    render(<WebsiteCard website={mockWebsite} />);

    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(10 ביקורות)")).toBeInTheDocument();
  });

  it("shows verified badge when website is verified", () => {
    render(<WebsiteCard website={mockWebsite} />);

    // Look for verified badge elements
    const verifiedElements = screen.getAllByTestId(/verified|badge/i);
    expect(verifiedElements.length).toBeGreaterThan(0);
  });

  it("displays correct pricing model", () => {
    render(<WebsiteCard website={mockWebsite} />);

    expect(screen.getByText("חינם")).toBeInTheDocument();
  });

  it("handles click events correctly", () => {
    render(<WebsiteCard website={mockWebsite} />);

    const card =
      screen.getByRole("article") || screen.getByTestId("website-card");
    fireEvent.click(card);

    expect(mockPush).toHaveBeenCalledWith("/tool/example.com");
  });

  it("renders website without reviews correctly", () => {
    const websiteWithoutReviews = {
      ...mockWebsite,
      averageRating: 0,
      reviewCount: 0,
    };

    render(<WebsiteCard website={websiteWithoutReviews} />);

    expect(screen.getByText("Test Website")).toBeInTheDocument();
    expect(screen.getByText("אין ביקורות עדיין")).toBeInTheDocument();
  });

  it("handles different pricing models", () => {
    const paidWebsite = {
      ...mockWebsite,
      pricingModel: "PAID" as const,
    };

    render(<WebsiteCard website={paidWebsite} />);

    expect(screen.getByText("בתשלום")).toBeInTheDocument();
  });

  it("renders fallback when no logo is provided", () => {
    const websiteWithoutLogo = {
      ...mockWebsite,
      logo: "",
    };

    render(<WebsiteCard website={websiteWithoutLogo} />);

    // Check for fallback logo or placeholder
    const logoElement =
      screen.getByAltText("Test Website logo") ||
      screen.getByTestId("website-logo-fallback");
    expect(logoElement).toBeInTheDocument();
  });
});
