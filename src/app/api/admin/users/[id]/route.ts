import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Website from "@/lib/models/Website";
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
      role,
      isWebsiteOwner,
      isVerifiedWebsiteOwner,
      relatedWebsite,
      workRole,
      workEmail,
      isAgreeMarketing,
      websiteId,
    } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (isWebsiteOwner !== undefined)
      updateData.isWebsiteOwner = isWebsiteOwner;
    if (isVerifiedWebsiteOwner !== undefined)
      updateData.isVerifiedWebsiteOwner = isVerifiedWebsiteOwner;
    if (relatedWebsite !== undefined)
      updateData.relatedWebsite = relatedWebsite;
    if (workRole !== undefined) updateData.workRole = workRole || null;
    if (workEmail !== undefined) updateData.workEmail = workEmail || null;
    if (isAgreeMarketing !== undefined)
      updateData.isAgreeMarketing = isAgreeMarketing;

    // If a website is being assigned, automatically set role to business_owner
    if (websiteId && relatedWebsite) {
      updateData.role = "business_owner";
      updateData.isWebsiteOwner = true;
      updateData.websites = websiteId;
    }

    const user = await User.findByIdAndUpdate(params.id, updateData, {
      new: true,
    }).select("-hashedPassword -resetToken");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If a website was selected, update the website document
    if (websiteId) {
      try {
        await Website.findByIdAndUpdate(websiteId, {
          owner: params.id,
          isVerified: true,
        });
      } catch (websiteError) {
        console.error("Error updating website:", websiteError);
        // Continue even if website update fails
      }
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
