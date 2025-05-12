import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CalendarDays, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getRandomBlogPosts } from "@/lib/actions/blog";

export async function RandomBlogPosts() {
  const posts = await getRandomBlogPosts(3);

  if (posts.length === 0) return null;

  return (
    <section
      className="relative py-20 bg-gradient-to-b from-secondary/50 to-white"
      dir="rtl"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#f0f6ff]/60" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,#3b82f608,#9333ea08,#3b82f608)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-foreground">
            נושאי בינה מלאכותית מובילים
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto my-2">
            מצא ביקורות על כלי בינה מלאכותית, חדשות ותובנות מומחים לניווט בנוף
            הבינה המלאכותית
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug}`}>
              <Card className="group h-full overflow-hidden border border-border bg-white shadow-sm hover:shadow-md transition-all">
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  {/* Category & Reading Time */}
                  <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <span>{post.estimatedReadTime} דקות קריאה</span>
                      <Clock className="w-4 h-4" />
                    </div>
                    {post.category && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors text-right text-foreground">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2 text-right">
                    {post.excerpt}
                  </p>

                  {/* Date & Read More */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="text-primary flex items-center gap-1 text-sm">
                      <ArrowLeft className="w-4 h-4" /> קרא עוד
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                      <CalendarDays className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Posts Button */}
        <div className="flex justify-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md hover:bg-primary/90 transition-all"
          >
            צפה בכל הפוסטים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
