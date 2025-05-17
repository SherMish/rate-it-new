import mongoose, { Schema } from "mongoose";
import { PricingModel } from "../types/website";

// Export the type for client-side use
export interface WebsiteType {
  _id: string;
  name: string;
  url: string;
  description?: string;
  shortDescription?: string;
  logo?: string;
  category?: string;
  pricingModel?: string;
  createdBy?: string | null;
  owner?: string | null;
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
  };
  createdAt?: Date;
  updatedAt?: Date;
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
    category: {
      type: String,
      required: true,
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
    launchYear: {
      type: Number,
      default: null,
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
