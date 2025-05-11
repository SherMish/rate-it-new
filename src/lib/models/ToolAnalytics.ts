import mongoose, { Schema, Document } from "mongoose";

enum eventType {
  page_visit = "page_visit",
  click_site_button = "click_site_button",
}

const ToolAnalyticsSchema = new Schema({
  websiteId: { type: Schema.Types.ObjectId, ref: "Website", required: true },
  eventType: { type: String, enum: Object.values(eventType), required: true },
  month: { type: String, required: true },
  visitors: { type: Number, default: 0 },
});

export default mongoose.models.ToolAnalytics ||
  mongoose.model("ToolAnalytics", ToolAnalyticsSchema);
