import ReviewForm from "@/components/review/review-form";
import ReviewLayout from "@/components/review/review-layout";
import connectDB from "@/lib/mongodb";
import { Website } from "@/lib/models";

export default async function WriteReviewPage({
  params,
}: {
  params: { url: string };
}) {
  const decodedUrl = decodeURIComponent(params.url);
  let businessName = "";

  try {
    await connectDB();
    const website = await Website.findOne({ url: decodedUrl }).lean();
    businessName = website?.name || decodedUrl;
  } catch (error) {
    console.error("Error fetching website:", error);
    businessName = decodedUrl;
  }

  return (
    <ReviewLayout title={`כתיבת ביקורת על ${businessName}`}>
      <ReviewForm initialUrl={decodedUrl} />
    </ReviewLayout>
  );
}
