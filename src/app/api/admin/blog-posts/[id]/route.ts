import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (process.env.IS_PRODUCTION === 'true') {
    return new NextResponse('Not authorized', { status: 401 });
  }

  try {
    await connectDB();
    const data = await request.json();

    const updatedPost = await BlogPost.findByIdAndUpdate(
      params.id,
      { ...data },
      { new: true }
    ).lean();

    if (!updatedPost) {
      return new NextResponse(
        JSON.stringify({ error: 'Blog post not found' }), 
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update blog post' }), 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (process.env.IS_PRODUCTION === 'true') {
    return new NextResponse('Not authorized', { status: 401 });
  }

  try {
    await connectDB();
    await BlogPost.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete blog post' }), 
      { status: 500 }
    );
  }
} 