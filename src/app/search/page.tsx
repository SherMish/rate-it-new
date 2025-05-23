import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Website } from "@/lib/models";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim();

  if (!query) {
    redirect("/");
  }

  try {
    await connectDB();

    const websites = await Website.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { url: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .select("name url category averageRating reviewCount")
      .lean();

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
              <div className="p-6 space-y-4">
                {websites.map((website, index) => (
                  <Link
                    key={website._id.toString()}
                    href={`/tool/${encodeURIComponent(website.url)}`}
                    className="block"
                  >
                    <Card className="p-6 hover:shadow-md transition-all duration-200 border-border/50 bg-background/80 hover:bg-background/90">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-semibold mb-2 text-foreground">
                            {website.name}
                          </h2>
                          <p className="text-sm text-muted-foreground mb-3 break-all">
                            {website.url}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(website.averageRating || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                              <span className="mr-2 text-sm text-muted-foreground">
                                ({website.averageRating?.toFixed(1) || "0.0"})
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {website.reviewCount || 0} ביקורות
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full whitespace-nowrap">
                          {website.category}
                        </span>
                      </div>
                    </Card>
                  </Link>
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
