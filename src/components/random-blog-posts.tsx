import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getRandomBlogPosts } from "@/lib/actions/blog";

export async function RandomBlogPosts() {
  const posts = await getRandomBlogPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="relative py-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#0A0F1F]/40" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,#2563eb10,#9333ea10,#2563eb10)] backdrop-blur-[100px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold">
            Trending AI Topics
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto my-2">
            Find AI tool reviews, news, and expert insights to navigate the AI
            landscape
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug}`}>
              <Card className="group h-full overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    {post.category && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {post.category}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.estimatedReadTime} min read</span>
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Date & Read More */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                    <span className="text-primary flex items-center gap-1 text-sm">
                      Read more <ArrowRight className="w-4 h-4" />
                    </span>
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
            className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
