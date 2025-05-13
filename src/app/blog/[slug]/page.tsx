import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import BlogPostModel from "@/lib/models/BlogPost";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
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
  const post = (await BlogPostModel.findOne({
    slug,
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
      name: "AI-Radar Team",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AI-Radar",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo_new.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
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
      title: "Post Not Found | AI-Radar Blog",
    };
  }

  return {
    title: `${post.title} | AI-Radar Blog`,
    description: post.excerpt,
    keywords: [
      "AI",
      "artificial intelligence",
      "technology",
      post.category,
    ].filter(Boolean),
    authors: [{ name: "AI-Radar Team" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["AI-Radar Team"],
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
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: "AI-Radar Blog",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      creator: "@ai_radar", // Replace with your actual Twitter handle
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
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
    <div className="min-h-screen bg-background">
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Background effects - same as home page */}
      {/* <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" /> */}
      <div className="fixed inset-0 bg-gradient-to-tr from-background to-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-90" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#1a1f2e,transparent)]" />

      <article className="relative container max-w-3xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Blog
        </Link>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.estimatedReadTime} min read</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-slate max-w-none
             [&>p]:leading-relaxed [&>p]:mb-4
            [&>h2]:text-foreground [&>h2]:font-semibold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-2xl
            [&>h3]:text-foreground [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-xl
            [&>h4]:text-foreground [&>h4]:font-semibold [&>h4]:mt-8 [&>h4]:mb-4 [&>h4]:text-lg
            [&>a]:text-primary [&>a]:no-underline hover:[&>a]:underline
            [&>strong]:text-foreground [&>strong]:font-semibold
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4
            [&>li]:my-2
            [&>blockquote]:border-l-4 [&>blockquote]:border-primary/50 [&>blockquote]:pl-4 [&>blockquote]:italic
            [&>table]:w-full [&>table]:my-6 [&>table]:text-sm
            [&>thead>tr>th]:border [&>thead>tr>th]:border-border/50 [&>thead>tr>th]:p-2 [&>thead>tr>th]:bg-secondary/50
            [&>tbody>tr>td]:border [&>tbody>tr>td]:border-border/50 [&>tbody>tr>td]:p-2
            [&>code]:text-primary [&>code]:bg-primary/10 [&>code]:px-1 [&>code]:rounded
            [&>pre]:bg-secondary/50 [&>pre]:p-4 [&>pre]:rounded-lg
            [&>img]:rounded-lg [&>img]:my-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Related Posts */}
      <div className="relative container max-w-3xl mx-auto px-4 mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-8">Continue Reading</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {relatedPosts.map((relatedPost) => (
            <Link key={relatedPost._id} href={`/blog/${relatedPost.slug}`}>
              <Card className="group h-full overflow-hidden border border-border/50 bg-secondary/50 backdrop-blur-sm hover:bg-secondary/80 transition-colors">
                {relatedPost.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  {relatedPost.category && (
                    <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-md text-sm mb-3">
                      {relatedPost.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
