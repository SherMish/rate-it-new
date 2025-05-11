import connectDB from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { Types } from "mongoose";

export async function getRandomBlogPosts(limit: number = 3) {
  try {
    await connectDB();

    const posts = await BlogPost.aggregate([
      { $match: { isPublished: true } },
      { $sample: { size: limit } },
      {
        $project: {
          title: 1,
          slug: 1,
          excerpt: 1,
          coverImage: 1,
          category: 1,
          publishedAt: 1,
          estimatedReadTime: 1,
        },
      },
    ]);

    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      publishedAt: post.publishedAt?.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching random blog posts:", error);
    return [];
  }
} 