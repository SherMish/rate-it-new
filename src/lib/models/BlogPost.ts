import mongoose, { Schema } from "mongoose";

const BlogPostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true, // For clean URLs
        lowercase: true,
    },
    content: {
        type: String, //pure html
        required: true,
    },
    excerpt: {
        type: String,
        required: true,
        maxlength: 300, // Short summary for previews
    },
    coverImage: {
        type: String, // URL of the main blog image
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    tags: {
        type: [String], // Example: ["AI Tools", "Productivity"]
        default: [],
    },
    views: {
        type: Number,
        default: 0, // Track popularity
    },
    likes: {
        type: Number,
        default: 0,
    },
    publishedAt: {
        type: Date,
    },
    isPublished: {
        type: Boolean,
        default: false, // Admin can review before publishing
    },
    estimatedReadTime: {
        type: Number, // Estimated time in minutes
        required: true,
    },
    relatedTools: [
        {
            type: Schema.Types.ObjectId,
            ref: "Website", // Link to AI tools related to the blog
        },
    ],
}, {
    timestamps: true // This adds createdAt and updatedAt fields automatically
});

export default mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);