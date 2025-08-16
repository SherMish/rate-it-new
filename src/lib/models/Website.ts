import mongoose, { ObjectId, Schema } from "mongoose";
import { PricingModel } from "../types/website";

// Export the type for client-side use
export interface WebsiteType {
  _id: ObjectId;
  name: string;
  url: string;
  description?: string;
  shortDescription?: string;
  logo?: string;
  categories?: string[];
  pricingModel?: PricingModel;
  createdBy?: ObjectId;
  owner?: ObjectId;
  isVerified?: boolean;
  reviewCount?: number;
  averageRating?: number;
  verifiedAt?: Date;
  launchYear?: number;
  isActive?: boolean;
  socialUrls: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  contact: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  address?: string;
  isVerifiedByRateIt?: boolean;
  licenseValidDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Serialized version for client components (ObjectIds converted to strings)
export interface SerializedWebsiteType extends Omit<WebsiteType, '_id' | 'createdBy' | 'owner'> {
  _id: string;
  createdBy?: string | null;
  owner?: string | null;
}

const WebsiteSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
      set: (url: string) => {
        if (!url) throw new Error("URL is required");
        return url
          .toLowerCase()
          .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
          .split("/")[0]
          .split(":")[0];
      },
    },
    description: {
      type: String,
      default: "",
    },
    shortDescription: {
      type: String,
      default: "",
    },
    categories: {
      type: [String],
      required: true,
      validate: {
        validator: function (categories: string[]) {
          return categories.length > 0 && categories.length <= 3;
        },
        message: "Categories must have between 1 and 3 items",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    logo: {
      type: String,
      default: "",
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    socialUrls: {
      type: Object,
      default: {},
    },
    contact: {
      type: Object,
      default: {},
    },
    pricingModel: {
      type: String,
      enum: Object.values(PricingModel),
      default: PricingModel.BASIC,
    },
    isVerifiedByRateIt: {
      type: Boolean,
      default: false,
    },
    licenseValidDate: {
      type: Date,
      default: null,
    },
    launchYear: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Delete the model if it exists to prevent the "Cannot overwrite model" error
if (mongoose.models.Website) {
  delete mongoose.models.Website;
}

// Create and export the model
const Website = mongoose.model("Website", WebsiteSchema);

// Helper function to update website review statistics
export async function updateWebsiteReviewStats(websiteId: string | ObjectId) {
  try {
    // Import Review model dynamically to avoid circular dependency
    const Review = mongoose.models.Review || (await import("./Review")).default;

    const reviews = await Review.find({ relatedWebsite: websiteId }).select(
      "rating"
    );
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) /
          reviewCount
        : 0;

    const updatedWebsite = await Website.findByIdAndUpdate(
      websiteId,
      {
        reviewCount,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      },
      { new: true }
    );

    if (!updatedWebsite) {
      throw new Error(`Website with ID ${websiteId} not found`);
    }

    console.log(
      `Updated website ${websiteId} stats: ${reviewCount} reviews, ${
        Math.round(averageRating * 10) / 10
      } avg rating`
    );

    return {
      reviewCount,
      averageRating: Math.round(averageRating * 10) / 10,
      websiteId: updatedWebsite._id,
    };
  } catch (error) {
    console.error("Error updating website review stats:", error);
    throw error;
  }
}

// Create indexes in a separate function that can be called explicitly
export async function createIndexes() {
  try {
    await Website.collection.createIndex(
      { url: 1 },
      { unique: true, sparse: true, background: true }
    );
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
}

export default Website;
