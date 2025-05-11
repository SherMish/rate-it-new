import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Website } from '@/lib/models';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json([]);
    }

    await connectDB();
    
    const websites = await Website.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { url: { $regex: query, $options: 'i' } },
      ]
    })
    .lean();

    console.log('Raw websites from DB:', JSON.stringify(websites, null, 2));

    const normalizedResults = websites.map(website => {
      const result = {
        _id: website._id.toString(),
        name: website.name,
        url: website.url || website.url
      };
      console.log('Normalized website:', result);
      return result;
    });
    
    console.log('Final results:', JSON.stringify(normalizedResults, null, 2));
    
    return NextResponse.json(normalizedResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([], { status: 500 });
  }
} 