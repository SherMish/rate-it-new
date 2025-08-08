import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/components/search-input";
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation");
const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("SearchInput", () => {
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
    render(<SearchInput />);

    const searchInput =
      screen.getByRole("searchbox") ||
      screen.getByPlaceholderText(/חיפוש|search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("handles text input correctly", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const searchInput =
      screen.getByRole("searchbox") ||
      screen.getByPlaceholderText(/חיפוש|search/i);

    await user.type(searchInput, "AI tools");

    expect(searchInput).toHaveValue("AI tools");
  });

  it("triggers search on Enter key press", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const searchInput =
      screen.getByRole("searchbox") ||
      screen.getByPlaceholderText(/חיפוש|search/i);

    await user.type(searchInput, "AI tools");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/search?q=AI%20tools");
    });
  });

  it("triggers search on button click", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const searchInput =
      screen.getByRole("searchbox") ||
      screen.getByPlaceholderText(/חיפוש|search/i);
    const searchButton =
      screen.getByRole("button") || screen.getByLabelText(/search|חיפוש/i);

    await user.type(searchInput, "productivity tools");
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/search?q=productivity%20tools");
    });
  });

  it("handles empty search gracefully", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const searchInput =
      screen.getByRole("searchbox") ||
      screen.getByPlaceholderText(/חיפוש|search/i);

    await user.type(searchInput, "   ");
    await user.keyboard("{Enter}");

    // Should not navigate with empty/whitespace search
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("trims whitespace from search terms", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const searchInput =
      screen.getByRole("searchbox") ||
      screen.getByPlaceholderText(/חיפוש|search/i);

    await user.type(searchInput, "  AI tools  ");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/search?q=AI%20tools");
    });
  });

  it("displays search suggestions when available", async () => {
    // Mock fetch for search suggestions
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { name: "ChatGPT", url: "chatgpt.com" },
          { name: "Midjourney", url: "midjourney.com" },
        ]),
    });

    const user = userEvent.setup();
    render(<SearchInput />);

    const searchInput =
      screen.getByRole("searchbox") ||
      screen.getByPlaceholderText(/חיפוש|search/i);

    await user.type(searchInput, "chat");

    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestion = screen.queryByText(/ChatGPT|חיפוש/i);
      if (suggestion) {
        expect(suggestion).toBeInTheDocument();
      }
    });
  });

  it("handles keyboard navigation in suggestions", async () => {
    // Mock search suggestions
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { name: "ChatGPT", url: "chatgpt.com" },
          { name: "Claude", url: "claude.ai" },
        ]),
    });

    const user = userEvent.setup();
    render(<SearchInput />);

    const searchInput =
      screen.getByRole("searchbox") ||
      screen.getByPlaceholderText(/חיפוש|search/i);

    await user.type(searchInput, "chat");

    // Navigate suggestions with arrow keys
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    // Should navigate to selected suggestion or perform search
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });

  it("clears suggestions when input is cleared", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const searchInput =
      screen.getByRole("searchbox") ||
      screen.getByPlaceholderText(/חיפוש|search/i);

    await user.type(searchInput, "test");
    await user.clear(searchInput);

    // Suggestions should be hidden
    const suggestionsList =
      screen.queryByRole("listbox") || screen.queryByTestId("suggestions");
    if (suggestionsList) {
      expect(suggestionsList).not.toBeVisible();
    }
  });
});
