import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Interface for User document
interface IUser extends mongoose.Document {
  name: string;
  email: string;
  hashedPassword: string;
  phone?: string;
  workRole?: string;
  workEmail?: string;
  image?: string;
  emailVerified?: Date;
  googleId?: string;
  websites?: mongoose.Types.ObjectId;
  role: "user" | "admin" | "business_owner" | "business_user";
  relatedWebsite?: string;
  isWebsiteOwner: boolean;
  isVerifiedWebsiteOwner: boolean;
  reviewCount: number;
  isAgreeMarketing: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
  lastLoginAt?: Date;
  verification: {
    code?: string;
    attempts: number;
    expires?: Date;
    websiteUrl?: string;
    businessName?: string;
    email?: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User model
interface IUserModel extends mongoose.Model<IUser> {
  safelyAssignGoogleId(userId: string, googleId: string): Promise<IUser>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    workRole: {
      type: String,
      default: null,
    },
    workEmail: {
      type: String,
      default: null,
    },
    image: String,
    emailVerified: Date,
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    websites: {
      // include ids of websites
      type: mongoose.Schema.Types.ObjectId,
      ref: "Website",
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin", "business_owner", "business_user"],
      default: "user",
    },
    relatedWebsite: {
      type: String,
      default: null,
    },
    isWebsiteOwner: {
      type: Boolean,
      default: false,
    },
    isVerifiedWebsiteOwner: {
      type: Boolean,
      default: false,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isAgreeMarketing: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
    lastLoginAt: Date,
    verification: {
      code: {
        type: String,
        default: null,
      },
      attempts: {
        type: Number,
        default: 0,
      },
      expires: {
        type: Date,
        default: null,
      },
      websiteUrl: {
        type: String,
        default: null,
      },
      businessName: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.hashedPassword);
};

// Static method to safely assign Google ID
UserSchema.statics.safelyAssignGoogleId = async function (userId: string, googleId: string) {
  try {
    // Check if Google ID is already used by another user
    const existingUserWithGoogleId = await this.findOne({ googleId });
    
    if (existingUserWithGoogleId && existingUserWithGoogleId._id.toString() !== userId) {
      throw new Error(`Google ID ${googleId} is already used by another user`);
    }
    
    // Update the user with the Google ID
    const updatedUser = await this.findByIdAndUpdate(
      userId,
      { googleId },
      { new: true }
    );
    
    return updatedUser;
  } catch (error) {
    console.error('Error assigning Google ID:', error);
    throw error;
  }
};

// Use mongoose.models.User if it exists, otherwise create a new model
const User = (mongoose.models.User as IUserModel) || mongoose.model<IUser, IUserModel>("User", UserSchema);

// Drop the existing index and create a new one
async function setupIndexes() {
  try {
    const collection = User.collection;
    // Drop the existing index if it exists
    await collection.dropIndex("googleId_1").catch(() => {});
    // Create a new sparse index
    await collection.createIndex(
      { googleId: 1 },
      {
        sparse: true,
        unique: true,
        background: true,
      }
    );
  } catch (error) {
    console.error("Error setting up indexes:", error);
  }
}

// Run the index setup
setupIndexes();

export default User;
