import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Website } from "@/lib/models";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { WebsiteCard } from "@/components/website-card";
import { WebsiteType } from "@/lib/models/Website";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

// Dynamic metadata generation for search pages
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q?.trim() || "";

  if (!query) {
    return {
      title: "חיפוש עסקים - Rate It",
      description: "חפש בין אלפי עסקים בישראל וקרא ביקורות אמיתיות מלקוחות",
    };
  }

  const encodedQuery = encodeURIComponent(query);
  const searchTitle = `תוצאות חיפוש עבור "${query}" - Rate It | ביקורות עסקים בישראל`;
  const searchDescription = `מצא עסקים עם ביקורות חיוביות עבור "${query}". קרא חוות דעת אמיתיות מלקוחות ובחר בחכמה עם Rate It.`;

  return {
    title: searchTitle,
    description: searchDescription,
    keywords: [
      `חיפוש ${query}`,
      "ביקורות עסקים",
      "דירוגים",
      "עסקים בישראל",
      `${query} ביקורות`,
      `${query} דירוג`,
      "חוות דעת לקוחות",
      "המלצות עסקים",
      "שירותים איכותיים",
      "בחירת עסק",
      "השוואת עסקים",
      "אמינות עסקית",
      "Rate It",
      "פלטפורמת ביקורות",
    ],
    openGraph: {
      type: "website",
      title: searchTitle,
      description: searchDescription,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/search?q=${encodedQuery}`,
      siteName: "Rate It",
      locale: "he_IL",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/og-search.png`,
          width: 1200,
          height: 630,
          alt: `תוצאות חיפוש עבור ${query} - Rate It`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `חיפוש "${query}" - Rate It`,
      description: `מצא עסקים איכותיים עבור "${query}" עם ביקורות אמיתיות מלקוחות`,
      images: {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-search.png`,
        alt: `תוצאות חיפוש ${query}`,
      },
      creator: "@RateItIL",
      site: "@RateItIL",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/search?q=${encodedQuery}`,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim();

  if (!query) {
    redirect("/");
  }

  // Generate JSON-LD structured data for search results
  const generateSearchJsonLd = (query: string, resultsCount: number) => ({
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `תוצאות חיפוש עבור "${query}"`,
    description: `${resultsCount} תוצאות נמצאו עבור החיפוש "${query}" בפלטפורמת Rate It`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/search?q=${encodeURIComponent(
      query
    )}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Rate It",
      url: process.env.NEXT_PUBLIC_APP_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: resultsCount,
      name: `תוצאות חיפוש עבור "${query}"`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "דף הבית",
          item: process.env.NEXT_PUBLIC_APP_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "חיפוש",
          item: `${process.env.NEXT_PUBLIC_APP_URL}/search`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `תוצאות עבור "${query}"`,
          item: `${
            process.env.NEXT_PUBLIC_APP_URL
          }/search?q=${encodeURIComponent(query)}`,
        },
      ],
    },
  });

  try {
    await connectDB();

    const websites = await Website.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { url: { $regex: query, $options: "i" } },
        { categories: { $regex: query, $options: "i" } },
      ],
    }).lean();

    const jsonLd = generateSearchJsonLd(query, websites.length);

    return (
      <main className="relative min-h-screen" dir="rtl">
        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Main background gradient - matching homepage */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f620,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

        <div className="relative container max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <div className="p-6 border-b border-border/50">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                תוצאות חיפוש
              </h1>
              <p className="text-muted-foreground">
                נמצאו {websites.length} תוצאות עבור &quot;{query}&quot;
              </p>
            </div>

            {websites.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-muted-foreground text-lg mb-4">
                  לא נמצאו עסקים דיגיטליים התואמים לחיפוש שלכם.
                </p>
                <p className="text-muted-foreground mb-8">
                  נסו לחפש עם מילות מפתח שונות או עיינו בקטגוריות שלנו.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/tool/new">
                    <Button className="gradient-button w-full sm:w-auto">
                      הוסיפו עסק חדש תוך שניות
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      עיינו בקטגוריות
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {websites.map((website) => (
                  <WebsiteCard
                    key={website._id.toString()}
                    website={website as unknown as WebsiteType}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error searching websites:", error);
    return (
      <main className="relative min-h-screen" dir="rtl">
        {/* Main background gradient - matching homepage */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f620,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

        <div className="relative container max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <div className="p-6 border-b border-border/50">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                תוצאות חיפוש
              </h1>
            </div>
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                לא ניתן לטעון את תוצאות החיפוש. אנא נסו שוב מאוחר יותר.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
