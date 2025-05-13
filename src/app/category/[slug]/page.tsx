import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import categoriesData from "@/lib/data/categories.json";
import { Website } from "@/lib/models";
import Link from "next/link";
import { Star, ChevronLeft, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebsiteCard } from "@/components/website-card";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the category page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const category = categoriesData.categories.find(
    (cat) => cat.id === params.slug
  );

  if (!category) {
    return {
      title: "Category Not Found | AI-Radar",
    };
  }

  return {
    title: `${category.name} AI Tools & Reviews | AI-Radar`,
    description: `Discover and compare the best ${category.name.toLowerCase()} AI tools. Read authentic reviews, ratings, and insights from real users.`,
    keywords: [
      `${category.name.toLowerCase()} ai tools`,
      "ai software reviews",
      "ai tool comparison",
      "best ai tools",
      `${category.name.toLowerCase()} ai software`,
      "ai tool ratings",
      "user reviews",
    ],
    openGraph: {
      title: `Best ${category.name} AI Tools - Reviews & Ratings`,
      description: `Find and compare top ${category.name.toLowerCase()} AI tools with authentic user reviews and ratings.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Best ${category.name} AI Tools - Reviews & Ratings`,
      description: `Find and compare top ${category.name.toLowerCase()} AI tools with authentic user reviews and ratings.`,
    },
  };
}

async function getCategoryTools(categoryId: string) {
  await connectDB();

  const tools = await Website.find({ category: categoryId })
    .sort({ radarTrust: -1 }) // Keep the sorting by radarTrust
    .lean();

  return tools;
}

export default async function CategoryPage({ params }: PageProps) {
  const category = categoriesData.categories.find(
    (cat) => cat.id === params.slug
  );
  if (!category) return notFound();

  const tools = await getCategoryTools(params.slug);

  // Get the icon component
  const IconComponent = (
    category.icon ? Icons[category.icon as keyof typeof Icons] : Star
  ) as LucideIcon;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

      <div className="relative container max-w-4xl mx-auto sm:px-4 py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            חזרה לעמוד הראשי
          </Link>
        </div>

        <div className="rounded-lg border border-border/50 bg-secondary/50 backdrop-blur-sm">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">
                <span>{category.name}</span>
              </h1>
            </div>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="p-4">
            {tools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  אופס, נראה שאין עדיין עסקים בקטגוריה שנבחרה :(
                </p>
                <p className="text-muted-foreground mb-8">
                  אבל הסירו דאגה מליבכם, אתם יכולים להיות הראשונים שיוסיפו עסק בקטגוריה!
                </p>
                <Link href="/tool/new">
                  <Button className="gradient-button">להוספה</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-6">
                  {tools.map((website) => (
                    <WebsiteCard
                      key={website._id.toString()}
                      website={website}
                    />
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Can&apos;t find the tool you&apos;re looking for?
                  </p>
                  <Link
                    href="/tool/new"
                    className="text-primary hover:text-primary/90 transition-colors"
                  >
                    Add it now in seconds →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
