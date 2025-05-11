import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const updateData = await request.json();
    console.log('Updating user with data:', updateData);

    // First, ensure the user exists with default values
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $setOnInsert: {
          phone: null,
          workRole: null,
          workEmail: null,
          relatedWebsite: null,
          isWebsiteOwner: false,
          isVerifiedWebsiteOwner: false,
          role: 'user',
          reviewCount: 0,
          isAgreeMarketing: false,
        }
      },
      { upsert: true }
    );

    // Then update with the new data
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: {
          ...(updateData.name && { name: updateData.name }),
          ...(updateData.phone && { phone: updateData.phone }),
          ...(updateData.workRole && { workRole: updateData.workRole }),
          ...(updateData.workEmail && { workEmail: updateData.workEmail }),
          ...(updateData.role && { role: updateData.role }),
          ...(updateData.isWebsiteOwner !== undefined && { isWebsiteOwner: updateData.isWebsiteOwner }),
          ...(updateData.isVerifiedWebsiteOwner !== undefined && { isVerifiedWebsiteOwner: updateData.isVerifiedWebsiteOwner }),
          ...(updateData.relatedWebsite && { relatedWebsite: updateData.relatedWebsite }),
          ...(updateData.websites && { websites: updateData.websites }),
          ...(updateData.verification === null && { verification: null }),
          updatedAt: new Date()
        }
      },
      { 
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('Updated user:', updatedUser);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ 
      error: "Failed to update user",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 