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
    redirect("/");
  }

  try {
    await connectDB();

    const reviews = await Review.find({
      relatedUser: session.user.id,
    })
      .populate({
        path: "relatedWebsite",
        select: "name url",
      })
      .populate({
        path: "relatedUser",
        select: "name",
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
      relatedUser: review.relatedUser
        ? {
            name: review.relatedUser.name,
          }
        : undefined,
      relatedWebsite: {
        name: review.relatedWebsite?.name || "כלי לא ידוע",
        url: review.relatedWebsite?.url || "#",
      },
    }));

    return (
      <div className="container mx-auto px-4 py-12 min-h-screen" dir="rtl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            הביקורות שלי
          </h1>
          <p className="mt-3 text-xl text-muted-foreground sm:mt-4">
            כל הביקורות שכתבתם על עסקים דיגיטליים שונים
          </p>
        </div>

        {formattedReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                עדיין לא כתבתם ביקורות
              </h3>
              <p className="text-muted-foreground mb-6">
                שתפו את החוויות שלכם עם עסקים דיגיטליים ועזרו לאחרים לקבל החלטות
                מושכלות.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                חזרה לדף הבית
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {formattedReviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen" dir="rtl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            הביקורות שלי
          </h1>
          <p className="mt-3 text-xl text-muted-foreground sm:mt-4">
            כל הביקורות שכתבתם על עסקים שונים
          </p>
        </div>
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              שגיאה בטעינת הביקורות
            </h3>
            <p className="text-muted-foreground mb-6">
              לא הצלחנו לטעון את הביקורות שלכם. אנא נסו שוב מאוחר יותר.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
