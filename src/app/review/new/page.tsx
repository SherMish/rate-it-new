"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Text Generation",
  "Image Generation",
  "Code Generation",
  "Audio Processing",
  "Video Generation",
  "Data Analysis",
  "General AI",
  "Other",
];

export default function NewReviewPage() {
  const searchParams = useSearchParams();
  const urlParam = searchParams?.get("url") ?? "";

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-secondary/50 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-border">
            <h1 className="text-2xl font-bold mb-6 gradient-text">Add New AI Tool Review</h1>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Tool Name</label>
                <Input 
                  required 
                  defaultValue="" 
                  className="bg-background/50 border-secondary-foreground/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input 
                  required 
                  defaultValue={urlParam} 
                  className="bg-background/50 border-secondary-foreground/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger className="bg-background/50 border-secondary-foreground/10">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <button
                      key={index}
                      type="button"
                      className="p-1"
                      onMouseEnter={() => setHoveredRating(index)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(index)}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          index <= (hoveredRating || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review</label>
                <Textarea
                  placeholder="Share your experience with this AI tool..."
                  className="h-32 bg-background/50 border-secondary-foreground/10"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Be honest and constructive with your feedback.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full gradient-button"
                size="lg"
              >
                Submit Review
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}