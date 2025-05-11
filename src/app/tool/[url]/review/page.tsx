import ReviewForm from "@/components/review/review-form";
import ReviewLayout from "@/components/review/review-layout";

export default function WriteReviewPage({ 
  params 
}: { 
  params: { url: string } 
}) {
  return (
    <ReviewLayout title="Write a Review">
      <ReviewForm initialUrl={decodeURIComponent(params.url)} />
    </ReviewLayout>
  );
}