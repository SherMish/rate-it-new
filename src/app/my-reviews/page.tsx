import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Review } from "@/lib/models";
import { ReviewCard } from "@/components/review-card";
import Link from "next/link";

export default async function MyReviewsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/');
  }

  try {
    await connectDB();

    
    const reviews = await Review.find({ 
      relatedUser: session.user.id 
    })
    .populate({
      path: 'relatedWebsite',
      select: 'name url'
    })
    .populate({
      path: 'relatedUser',
      select: 'name'
    })
    .sort({ createdAt: -1 })
    .lean();


    const formattedReviews = reviews.map((review: any) => ({
      _id: review._id.toString(),
      title: review.title,
      body: review.body,
      rating: review.rating,
      createdAt: review.createdAt,
      helpfulCount: review.helpfulCount || 0,
      relatedUser: review.relatedUser ? {
        name: review.relatedUser.name
      } : undefined,
      relatedWebsite: {
        name: review.relatedWebsite?.name || 'Unknown Tool',
        url: review.relatedWebsite?.url || '#'
      }
    }));

    return (
      <div className="relative min-h-screen bg-background">
        {/* Background effects */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        <div className="relative container max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 gradient-text">My Reviews</h1>
          
          {formattedReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                You haven&apos;t written any reviews yet.
              </p>
              <p className="text-muted-foreground">
                Share your experience with AI tools and help others make informed decisions.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {formattedReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return (
      <div className="relative min-h-screen bg-background">
        {/* Background effects */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        <div className="relative container max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 gradient-text">My Reviews</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Unable to load reviews. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}