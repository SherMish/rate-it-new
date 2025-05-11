import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
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
  websites: { // include ids of websites
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'business_owner', 'business_user'],
    default: 'user',
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
    token: {
      type: String,
      default: null
    },
    expires: {
      type: Date,
      default: null
    },
    websiteUrl: {
      type: String,
      default: null
    }
  },
}, {
  timestamps: true,
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.hashedPassword);
};

// Use mongoose.models.User if it exists, otherwise create a new model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Drop the existing index and create a new one
async function setupIndexes() {
  try {
    const collection = User.collection;
    // Drop the existing index if it exists
    await collection.dropIndex('googleId_1').catch(() => {});
    // Create a new sparse index
    await collection.createIndex({ googleId: 1 }, { 
      sparse: true,
      unique: true,
      background: true 
    });
  } catch (error) {
    console.error('Error setting up indexes:', error);
  }
}

// Run the index setup
setupIndexes();

export default User; 