import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Website } from '@/lib/models';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const website = await Website.findOne({ url: url })
      .select('_id url')
      .lean();
    
    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(website);
  } catch (error) {
    console.error('Find website error:', error);
    return NextResponse.json(
      { error: 'Failed to find website' },
      { status: 500 }
    );
  }
} 