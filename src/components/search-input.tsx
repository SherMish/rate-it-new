"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Suggestion {
  _id: string;
  name: string;
  url: string;
}

interface SearchInputProps {
  className?: string;
  onSearch: (query: string) => void;
  variant?: "default" | "header";
}

export function SearchInput({
  className,
  onSearch,
  variant = "default",
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 2) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      setIsLoading(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/websites/search?q=${encodeURIComponent(trimmedQuery)}`
          );
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      onSearch(trimmedQuery);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative w-full" ref={suggestionsRef}>
      <form
        onSubmit={handleSubmit}
        className={`relative w-full ${className || ""}`}
      >
        <div
          className={cn(
            "flex gap-2",
            variant === "default" ? "flex-col sm:flex-row" : "flex-row"
          )}
        >
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="חפש כלי בינה מלאכותית"
              className={cn(
                "w-full bg-secondary/50 border-secondary-foreground/10 gradient-border text-right",
                variant === "default" ? "h-12 pr-12 text-lg" : "h-10 pr-10"
              )}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
                variant === "default" ? "right-4 h-5 w-5" : "right-3 h-4 w-4"
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={query.length < 2}
            size={variant === "default" ? "lg" : "default"}
            className={cn(
              variant === "default"
                ? "h-12 w-full sm:w-[120px] gradient-button"
                : "bg-transparent gradient-border hidden sm:inline-flex"
            )}
          >
            חיפוש
          </Button>
        </div>
      </form>

      {showSuggestions && query && (
        <div className="absolute w-full mt-2 bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-2 space-y-1 z-50 max-h-90 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {suggestions.length > 0 &&
                suggestions.map((suggestion, index) => (
                  <Link
                    key={suggestion._id}
                    href={`/tool/${encodeURIComponent(suggestion.url)}`}
                    className={`flex items-center p-3 rounded-md transition-colors
                    ${
                      index === selectedIndex
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50 hover:text-primary"
                    }
                  `}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onMouseLeave={() => setSelectedIndex(-1)}
                    onClick={clearSearch}
                  >
                    <div className="flex flex-col items-start">
                      <div className="font-medium text-right w-full">
                        {suggestion.name}
                      </div>
                      <div className="text-sm text-muted-foreground text-right w-full">
                        {suggestion.url}
                      </div>
                    </div>
                  </Link>
                ))}
              <div
                className={
                  suggestions.length > 0
                    ? "border-t border-border mt-2 pt-2"
                    : ""
                }
              >
                <Link
                  href="/tool/new"
                  className="flex items-center p-3 rounded-md hover:bg-muted/50 hover:text-primary transition-colors text-primary"
                  onClick={clearSearch}
                >
                  <div className="font-medium text-right w-full">
                    לא מצאת את הכלי? הוסף אותו עכשיו בשניות!
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
