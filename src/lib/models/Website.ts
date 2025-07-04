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
      default: PricingModel.FREE,
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
