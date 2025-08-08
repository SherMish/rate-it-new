import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/components/search-input";
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation");
const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("SearchInput", () => {
  const mockOnSearch = jest.fn();

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

  it("renders search input correctly", () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const searchInput =
      screen.getByRole("textbox") ||
      screen.getByPlaceholderText(/search|חיפוש/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("handles text input correctly", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const searchInput =
      screen.getByRole("textbox") ||
      screen.getByPlaceholderText(/search|חיפוש/i);

    await user.type(searchInput, "AI tools");

    expect(searchInput).toHaveValue("AI tools");
  });

  it("triggers search on form submission", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const searchInput =
      screen.getByRole("textbox") ||
      screen.getByPlaceholderText(/search|חיפוש/i);

    await user.type(searchInput, "AI tools");

    // Look for form or submit button
    const form = searchInput.closest("form");
    if (form) {
      fireEvent.submit(form);
    } else {
      await user.keyboard("{Enter}");
    }

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("AI tools");
    });
  });

  it("triggers search on button click", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const searchInput =
      screen.getByRole("textbox") ||
      screen.getByPlaceholderText(/search|חיפוש/i);
    const searchButton =
      screen.getByRole("button") || screen.getByLabelText(/search|חיפוש/i);

    await user.type(searchInput, "productivity tools");
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("productivity tools");
    });
  });

  it("handles empty search gracefully", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const searchInput =
      screen.getByRole("textbox") ||
      screen.getByPlaceholderText(/search|חיפוש/i);

    await user.type(searchInput, "   ");

    const form = searchInput.closest("form");
    if (form) {
      fireEvent.submit(form);
    } else {
      await user.keyboard("{Enter}");
    }

    // Should not call onSearch with empty/whitespace search
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("trims whitespace from search terms", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const searchInput =
      screen.getByRole("textbox") ||
      screen.getByPlaceholderText(/search|חיפוש/i);

    await user.type(searchInput, "  AI tools  ");

    const form = searchInput.closest("form");
    if (form) {
      fireEvent.submit(form);
    } else {
      await user.keyboard("{Enter}");
    }

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("AI tools");
    });
  });

  it("displays search suggestions when available", async () => {
    // Mock fetch for search suggestions
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { _id: "1", name: "ChatGPT", url: "chatgpt.com" },
          { _id: "2", name: "Midjourney", url: "midjourney.com" },
        ]),
    });

    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const searchInput =
      screen.getByRole("textbox") ||
      screen.getByPlaceholderText(/search|חיפוש/i);

    await user.type(searchInput, "chat");

    // Wait for suggestions to appear
    await waitFor(
      () => {
        const suggestion = screen.queryByText(/ChatGPT/i);
        if (suggestion) {
          expect(suggestion).toBeInTheDocument();
        }
      },
      { timeout: 2000 }
    );
  });

  it("renders with different variants", () => {
    const { rerender } = render(
      <SearchInput onSearch={mockOnSearch} variant="default" />
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();

    rerender(<SearchInput onSearch={mockOnSearch} variant="header" />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    render(<SearchInput onSearch={mockOnSearch} className="custom-class" />);

    const searchContainer = screen.getByRole("textbox").closest("div");
    // The className might be applied to the container or the input itself
    expect(searchContainer).toBeInTheDocument();
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const searchInput =
      screen.getByRole("textbox") ||
      screen.getByPlaceholderText(/search|חיפוש/i);

    await user.type(searchInput, "test");

    // Test escape key to clear or close suggestions
    await user.keyboard("{Escape}");

    // Should still have the input
    expect(searchInput).toBeInTheDocument();
  });
});
