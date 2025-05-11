import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Website from '@/lib/models/Website';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Category from '@/lib/models/Category';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const verified = searchParams.get('verified');
    
    const query: any = {};
    if (category) query.relatedCategory = category;
    if (verified) query.isVerified = verified === 'true';
    
    const websites = await Website.find(query)
      .populate('relatedCategory', 'name')
      .populate('owner', 'name');
    
    return NextResponse.json(websites);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const websiteData = await request.json();
    await connectDB();
    
    // Get or create a default category (you can modify this later)
    let defaultCategory = await Category.findOne({ name: "Uncategorized" });
    if (!defaultCategory) {
      defaultCategory = await Category.create({
        name: "Uncategorized",
        description: "Tools pending categorization",
      });
    }
    
    const website = await Website.create({
      ...websiteData,
      relatedCategory: defaultCategory._id,
      isVerified: false,
    });
    
    return NextResponse.json(website);
  } catch (error: any) {
    console.error('Error creating website:', error);
    
    // Handle duplicate URL error
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          error: 'This tool has already been added',
          code: 11000 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create website' },
      { status: 500 }
    );
  }
} 