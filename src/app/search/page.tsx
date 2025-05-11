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
    redirect('/');
  }

  try {
    await connectDB();

    const websites = await Website.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { url: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name url category averageRating reviewCount')
    .lean();

    return (
      <div className="relative min-h-screen bg-background">
        {/* Background effects */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        <div className="relative container max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-lg border border-border/50 bg-secondary/50 backdrop-blur-sm">
            <div className="p-6 border-b border-border/50">
              <h1 className="text-3xl font-bold gradient-text">
                Search Results
              </h1>
              <p className="text-muted-foreground mt-2">
                Found {websites.length} results for &quot;{query}&quot;
              </p>
            </div>

            {websites.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No AI tools found matching your search.
                </p>
                <p className="text-muted-foreground mb-8">
                  Try searching with different keywords or browse our categories.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/tool/new">
                    <Button className="gradient-button w-full sm:w-auto">
                      Add New Tool in Seconds
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Browse Categories
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {websites.map((website, index) => (
                  <div key={website._id.toString()} 
                    className={index % 2 === 1 ? "mb-12" : ""}>
                    <Link 
                      href={`/tool/${encodeURIComponent(website.url)}`}
                    >
                      <Card className="p-6 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors border-zinc-700/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-semibold mb-1 text-zinc-50">
                              {website.name}
                            </h2>
                            <p className="text-sm text-zinc-300 mb-3 truncate">
                              {website.url}
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < (website.averageRating || 0)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-zinc-600"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-zinc-400">
                                {website.reviewCount || 0} reviews
                              </span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full whitespace-nowrap">
                            {website.category}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error searching websites:', error);
    return (
      <div className="relative min-h-screen bg-background">
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        <div className="relative container max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Search Results</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Unable to load search results. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
} 