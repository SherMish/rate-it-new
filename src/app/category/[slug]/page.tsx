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
      title: "קטגוריה לא נמצאה | רייט-איט",
    };
  }

  return {
    title: `${category.name} עסקים וביקורות | רייט-איט`,
    description: `גלה והשווה את העסקים הטובים ביותר ב${category.name}. קרא ביקורות אותנטיות, דירוגים ותובנות ממשתמשים אמיתיים.`,
    keywords: [
      `${category.name.toLowerCase()} עסקים`,
      "ביקורות עסקים",
      "השוואת עסקים",
      "עסקים מובילים",
      `${category.name.toLowerCase()} ביקורות`,
      "דירוגי עסקים",
      "ביקורות משתמשים",
    ],
    openGraph: {
      title: `העסקים הטובים ביותר ב${category.name} - ביקורות ודירוגים`,
      description: `מצא והשווה עסקים מובילים ב${category.name.toLowerCase()} עם ביקורות ודירוגים אותנטיים ממשתמשים.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `העסקים הטובים ביותר ב${category.name} - ביקורות ודירוגים`,
      description: `מצא והשווה עסקים מובילים ב${category.name.toLowerCase()} עם ביקורות ודירוגים אותנטיים ממשתמשים.`,
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
    <div className="relative min-h-screen bg-background" dir="rtl">
      {/* Background effects - match main page */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f620,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

      <div className="relative container max-w-4xl mx-auto sm:px-4 py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4 ml-1" />
            חזרה לעמוד הראשי
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-white shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
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
                  אבל הסירו דאגה מליבכם, אתם יכולים להיות הראשונים שיוסיפו עסק
                  בקטגוריה!
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
                    לא מצאת את העסק שאתה מחפש?
                  </p>
                  <Link
                    href="/tool/new"
                    className="text-primary hover:text-primary/90 transition-colors"
                  >
                    הוסף אותו עכשיו בשניות ←
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
