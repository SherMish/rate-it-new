import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Website from '@/lib/models/Website';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import categoriesData from '@/lib/data/categories.json';

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

    const [websites, total] = await Promise.all([
      Website.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Website.countDocuments()
    ]);

    return NextResponse.json({
      websites: websites.map(website => ({
        ...website,
        _id: website._id.toString(),
        createdAt: website.createdAt?.toISOString(),
        updatedAt: website.updatedAt?.toISOString(),
      })),
      total
    });
  } catch (error) {
    console.error('Error fetching websites:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch websites' }), 
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
    const { url, name } = await request.json();

    // Check if website already exists
    const existingWebsite = await Website.findOne({ url });
    if (existingWebsite) {
      return new NextResponse(
        JSON.stringify({ error: 'Website already exists' }), 
        { status: 400 }
      );
    }

    // Get current user
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Create website with default/temporary values
    const website = await Website.create({
      url,
      name,
      category: categoriesData.categories[0].id,
      createdBy: userId || '000000000000000000000000',
      description: '',
      shortDescription: '',
      isActive: true,
    });

    return NextResponse.json(website);
  } catch (error) {
    console.error('Error creating website:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create website' }), 
      { status: 500 }
    );
  }
} 