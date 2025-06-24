import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import BlogPostModel from "@/lib/models/BlogPost";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/lib/types/blog";
import { Card } from "@/components/ui/card";
import { Types } from "mongoose";
import { headers } from "next/headers";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getBlogPost(slug: string) {
  await connectDB();
  // Decode the URL-encoded slug to match database entries
  const decodedSlug = decodeURIComponent(slug);
  const post = (await BlogPostModel.findOne({
    slug: decodedSlug,
    isPublished: true,
  }).lean()) as unknown as BlogPost & { _id: any };

  if (!post) return null;

  return {
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
  };
}

async function getRandomPosts(currentPostId: string, limit: number = 2) {
  await connectDB();
  const posts = await BlogPostModel.aggregate([
    {
      $match: {
        _id: { $ne: new Types.ObjectId(currentPostId) },
        isPublished: true,
      },
    },
    { $sample: { size: limit } },
    {
      $project: {
        title: 1,
        slug: 1,
        excerpt: 1,
        coverImage: 1,
        category: 1,
        estimatedReadTime: 1,
      },
    },
  ]);

  return posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
  }));
}

function generateStructuredData(post: BlogPost, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "Rate It Team",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Rate It",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo_new.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/business/blog/${post.slug}`,
    },
    wordCount: post.content.split(/\s+/g).length,
    articleBody: post.content.replace(/<[^>]+>/g, ""), // Strip HTML tags
    timeRequired: `PT${post.estimatedReadTime}M`,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  const headersList = headers();
  const baseUrl = `https://${headersList.get("host")}`;

  if (!post) {
    return {
      title: "פוסט לא נמצא | Rate It בלוג",
    };
  }

  return {
    title: `${post.title} | Rate It בלוג`,
    description: post.excerpt,
    keywords: [
      "ביקורות עסקים",
      "מוניטין דיגיטלי",
      "עסקים בישראל",
      post.category,
    ].filter(Boolean),
    authors: [{ name: "Rate It Team" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["Rate It Team"],
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
      url: `${baseUrl}/business/blog/${post.slug}`,
      siteName: "Rate It בלוג",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      creator: "@RateItIL",
    },
    alternates: {
      canonical: `${baseUrl}/business/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);
  const headersList = headers();
  const baseUrl = `https://${headersList.get("host")}`;

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRandomPosts(post._id.toString());
  const structuredData = generateStructuredData(post, baseUrl);

  return (
    <main className="relative min-h-screen" dir="rtl">
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Main background gradient - matching other pages */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f620,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

      <article className="relative container max-w-4xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/business/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          חזרה לבלוג
        </Link>

        {/* Article Container */}
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
          {/* Header */}
          <header className="p-8 pb-6 border-b border-border/20">
            {post.category && (
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.estimatedReadTime} דקות קריאה</span>
              </div>
            </div>
          </header>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="px-8 py-6 bg-primary/5 border-b border-border/20">
              <p className="text-lg text-foreground leading-relaxed font-medium italic">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-[400px] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                 [&>p]:leading-relaxed [&>p]:mb-4 [&>p]:text-foreground
                [&>h2]:text-foreground [&>h2]:font-semibold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-2xl
                [&>h3]:text-foreground [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-xl
                [&>h4]:text-foreground [&>h4]:font-semibold [&>h4]:mt-8 [&>h4]:mb-4 [&>h4]:text-lg
                [&>a]:text-primary [&>a]:no-underline hover:[&>a]:underline
                [&>strong]:text-foreground [&>strong]:font-semibold
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4
                [&>li]:my-2 [&>li]:text-foreground
                [&>blockquote]:border-r-4 [&>blockquote]:border-primary/50 [&>blockquote]:pr-4 [&>blockquote]:italic [&>blockquote]:bg-primary/5 [&>blockquote]:py-2
                [&>table]:w-full [&>table]:my-6 [&>table]:text-sm
                [&>thead>tr>th]:border [&>thead>tr>th]:border-border/50 [&>thead>tr>th]:p-2 [&>thead>tr>th]:bg-secondary/50
                [&>tbody>tr>td]:border [&>tbody>tr>td]:border-border/50 [&>tbody>tr>td]:p-2
                [&>code]:text-primary [&>code]:bg-primary/10 [&>code]:px-1 [&>code]:rounded
                [&>pre]:bg-secondary/50 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-border/50
                [&>img]:rounded-lg [&>img]:my-8 [&>img]:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="relative container max-w-4xl mx-auto px-4 mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            המשיכו לקרוא
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost._id}
                href={`/business/blog/${relatedPost.slug}`}
              >
                <Card className="group h-full overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-lg hover:shadow-xl">
                  {relatedPost.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {relatedPost.category && (
                      <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-md text-sm mb-3 font-medium">
                        {relatedPost.category}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
