import mongoose from 'mongoose';

const PendingVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  websiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
  },
  verificationToken: {
    type: String,
    required: true,
  },
  verificationEmail: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
});

export default mongoose.models.PendingVerification || 
  mongoose.model('PendingVerification', PendingVerificationSchema); 