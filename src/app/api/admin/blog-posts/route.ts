import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import { BlogPost as BlogPostType } from '@/lib/types/blog';

export async function GET(request: Request) {
  if (process.env.IS_PRODUCTION === 'true') {
    return new NextResponse('Not authorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectDB();

    const [posts, total] = await Promise.all([
      BlogPost.find()
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as unknown as (BlogPostType & { _id: any })[],
      BlogPost.countDocuments()
    ]);

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
      })),
      total
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch blog posts' }), 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (process.env.IS_PRODUCTION === 'true') {
    return new NextResponse('Not authorized', { status: 401 });
  }

  try {
    await connectDB();
    const data = await request.json();

    // Create blog post
    const blogPost = await BlogPost.create(data);

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create blog post' }), 
      { status: 500 }
    );
  }
} 