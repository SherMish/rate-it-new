import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Website from '@/lib/models/Website';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (process.env.IS_PRODUCTION === 'true') {
    return new NextResponse('Not authorized', { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const website = await Website.findByIdAndUpdate(
      params.id,
      { 
        $set: {
          name: body.name,
          url: body.url,
          description: body.description,
          shortDescription: body.shortDescription,
          category: body.category,
          logo: body.logo,
          pricingModel: body.pricingModel,
          hasFreeTrialPeriod: body.hasFreeTrialPeriod,
          hasAPI: body.hasAPI,
          launchYear: body.launchYear,
          radarTrust: body.radarTrust,
          radarTrustExplanation: body.radarTrustExplanation,
        }
      },
      { new: true }
    );

    if (!website) {
      return new NextResponse('Website not found', { status: 404 });
    }

    return NextResponse.json(website);
  } catch (error) {
    console.error('Error updating website:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 