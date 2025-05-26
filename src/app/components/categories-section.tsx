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
  Shirt,
  TabletSmartphone,
  Home,
  Pizza,
  Dumbbell,
  Baby,
  HeartPulse,
  Car,
  PawPrint,
  BookOpen,
  Plane,
  CreditCard,
  Megaphone,
  Building,
  Scale,
  Cpu,
  Gift,
  Printer,
  Gem,
  CalendarHeart,
  Repeat,
  Store,
  Book,
  Camera,
  Wifi,
  Activity,
  Stethoscope,
  GraduationCap,
  Mic,
  FlaskRound,
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
  Shirt,
  TabletSmartphone,
  Home,
  Pizza,
  Dumbbell,
  Baby,
  HeartPulse,
  Car,
  PawPrint,
  BookOpen,
  Plane,
  CreditCard,
  Megaphone,
  Building,
  Scale,
  Cpu,
  Gift,
  Printer,
  Gem,
  CalendarHeart,
  Repeat,
  Store,
  Book,
  Camera,
  Wifi,
  Activity,
  Stethoscope,
  GraduationCap,
  Mic,
  FlaskRound,
};

export function CategoriesSection() {
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll
    ? categoriesData.categories
    : categoriesData.categories.slice(0, 8);

  // Debug statement to check for missing icons
  const missingIcons = visibleCategories
    .filter((category) => !(category.icon in Icons))
    .map((category) => category.icon);

  if (missingIcons.length > 0) {
    console.warn("Missing icons:", missingIcons);
  }

  return (
    <div className="py-16 pb-8 relative bg-gradient-to-b from-slate-50/80 to-white border-y border-border/30 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Categories header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            מה אתם מחפשים היום?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {visibleCategories.map((category) => {
            const Icon = Icons[category.icon as keyof typeof Icons] || Sparkles; // Fallback to Sparkles if icon not found
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="block h-full"
              >
                <Card className="p-4 bg-white hover:bg-blue-50 transition-colors group h-full flex flex-col border border-border shadow-md hover:shadow-lg">
                  <div className="flex items-start gap-3 h-full">
                    <div className="w-10 h-10 rounded-lg bg-primary/15 flex-shrink-0 flex items-center justify-center group-hover:bg-primary/25 transition-colors rtl:ml-0 rtl:mr-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-h-0 text-right">
                      <div className="font-medium mb-1 text-foreground">
                        {category.name}
                      </div>
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
              className="group bg-white border border-border hover:bg-blue-50 shadow-md"
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
