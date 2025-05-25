export const revalidate = 100; // Revalidate every 100 seconds

import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import BlogPostModel from "@/lib/models/BlogPost";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { BlogPost } from "@/lib/types/blog";

export const metadata: Metadata = {
  title: "בלוג Rate It - מדריכים, טיפים ותובנות על ניהול מוניטין דיגיטלי",
  description:
    "התעדכנו בטיפים, מדריכים ותובנות מעשיות שיעזרו לכם לבלוט עם העסק שלכם אונליין. כל מה שצריך לדעת על ביקורות, אמון ומיתוג לעסקים בישראל.",
  openGraph: {
    title: "בלוג Rate It - תוכן מקצועי לעסקים שרוצים לבלוט",
    description:
      "מאמרים, מדריכים ותובנות מקצועיות על איך לנהל ביקורות, לבנות אמון, ולשפר את הנוכחות הדיגיטלית של העסק שלכם.",
    type: "website",
  },
};

async function getBlogPosts() {
  await connectDB();
  const posts = await BlogPostModel.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .lean();

  return posts.map((post) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    author: post.author,
    category: post.category,
    tags: post.tags,
    views: post.views,
    likes: post.likes,
    publishedAt: post.publishedAt?.toISOString(),
    isPublished: post.isPublished,
    estimatedReadTime: post.estimatedReadTime,
    relatedTools: post.relatedTools,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  })) as BlogPost[];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects - same as home page */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="fixed inset-0 bg-gradient-to-tr from-background to-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-90" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#1a1f2e,transparent)]" />

      <div className="relative container max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12" dir="rtl">
          <h1 className="text-4xl font-bold mb-4">
            איך לגרום ללקוחות לבחור דווקא בך? הבלוג שיעשה לך סדר{" "}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            מה הופך ביקורת לאפקטיבית? איך מזמינים ביקורות בלי להציק? ואיך ממנפים
            דירוגים לצמיחה עסקית? כאן תמצאו את כל התשובות.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post._id.toString()} href={`/blog/${post.slug}`}>
              <Card className="group h-full overflow-hidden border border-border/50 bg-secondary/50 backdrop-blur-sm hover:bg-secondary/80 transition-colors">
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
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Date & Read More */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <time dateTime={post.publishedAt?.toString()}>
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
      </div>
    </div>
  );
}
