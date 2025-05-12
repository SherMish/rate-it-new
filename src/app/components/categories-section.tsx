"use client";

import {
  MessageSquare,
  Image as ImageIcon,
  Code,
  Music,
  Video,
  Database,
  Brain,
  Sparkles,
  Palette,
  Bot,
  Briefcase,
  PenTool,
  FileText,
  BarChart,
  Microscope,
  Users,
  Globe,
  Headphones,
  Search as SearchIcon,
  Zap,
  ChevronUp,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import categoriesData from "@/lib/data/categories.json";

// Create an icons map
const Icons: Record<string, LucideIcon> = {
  MessageSquare,
  ImageIcon,
  Code,
  Music,
  Video,
  Database,
  Brain,
  Sparkles,
  Palette,
  Bot,
  Briefcase,
  PenTool,
  FileText,
  BarChart,
  Microscope,
  Users,
  Globe,
  Headphones,
  SearchIcon,
  Zap,
};

export function CategoriesSection() {
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll
    ? categoriesData.categories
    : categoriesData.categories.slice(0, 8);

  return (
    <div className="py-16 pb-8 relative">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            חקור כלי בינה מלאכותית לפי קטגוריה
          </h2>
          <p className="text-muted-foreground text-lg">
            מצא את כלי הבינה המלאכותית המושלם לצרכים הספציפיים שלך
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleCategories.map((category) => {
            const Icon = Icons[category.icon as keyof typeof Icons];
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="block h-full"
              >
                <Card className="p-4 hover:bg-secondary/50 transition-colors group h-full flex flex-col">
                  <div className="flex items-start gap-3 h-full">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center group-hover:bg-primary/20 transition-colors rtl:ml-0 rtl:mr-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-h-0 text-right">
                      <div className="font-medium mb-1">{category.name}</div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Show More/Less Button */}
        {categoriesData.categories.length > 8 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="group"
            >
              {showAll ? (
                <>
                  הצג פחות
                  <ChevronUp className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                </>
              ) : (
                <>
                  הצג עוד קטגוריות
                  <ChevronDown className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
