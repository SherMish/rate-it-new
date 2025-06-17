import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";
import { PricingModel } from "@/lib/types/website";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    const {
      name,
      url,
      description,
      shortDescription,
      categories,
      logo,
      launchYear,
      address,
      contact,
      socialUrls,
      // License management fields
      pricingModel,
      isVerified,
      isVerifiedByRateIt,
      licenseValidDate,
      isActive,
    } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined)
      updateData.shortDescription = shortDescription;
    if (categories !== undefined) updateData.categories = categories;
    if (logo !== undefined) updateData.logo = logo;
    if (launchYear !== undefined) updateData.launchYear = launchYear;
    if (address !== undefined) updateData.address = address;
    if (contact !== undefined) updateData.contact = contact;
    if (socialUrls !== undefined) updateData.socialUrls = socialUrls;

    // License management fields
    if (pricingModel !== undefined) updateData.pricingModel = pricingModel;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (isVerifiedByRateIt !== undefined)
      updateData.isVerifiedByRateIt = isVerifiedByRateIt;
    if (licenseValidDate !== undefined) {
      updateData.licenseValidDate = licenseValidDate
        ? new Date(licenseValidDate)
        : null;
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const website = await Website.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    return NextResponse.json(website);
  } catch (error: any) {
    console.error("Error updating website:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
