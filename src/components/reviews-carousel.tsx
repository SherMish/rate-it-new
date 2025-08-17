"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingTiles from "@/components/ui/rating-tiles";
import Link from "next/link";
import Image from "next/image";

interface ReviewData {
  _id: string;
  title: string;
  body: string;
  rating: number;
  relatedUser: {
    name: string;
  };
  relatedWebsite: {
    name: string;
    url: string;
    logo?: string;
  };
}

// Hardcoded reviews data based on the provided information
const reviewsData: ReviewData[] = [
  {
    _id: "6838cbdd73864699e0533f21",
    title: "הכל עבר חלק",
    body: "אחרי תהליך פשוט יחסית באתר שלהם ומילוי טופס קיבלתי את ההחזר. לצורך שאלה דיברתי איתם גם בטלפון והיה מענה מהיר ונחמד. מומלץ",
    rating: 5,
    relatedUser: {
      name: "נהוראי ס"
    },
    relatedWebsite: {
      name: "פינאפ Finupp",
      url: "finupp.meitavdash.co.il",
      logo: "https://res.cloudinary.com/dwqdhp70e/image/upload/v1748539193/ekclzus6tuusawn8vpue.svg"
    }
  },
  {
    _id: "6838cc84c2daefa68d66bc16",
    title: "שירות טוב",
    body: "כל פעם שיש לנו תקלה באינטרנט מגיע טכנאי תוך יום/יומיים ודואג לטפל בהכל. המחיר קצת גבוה אבל סה״כ אנחנו מבסוטים",
    rating: 5,
    relatedUser: {
      name: "יורי פיינלב"
    },
    relatedWebsite: {
      name: "פרטנר Partner",
      url: "partner.co.il",
      logo: "https://res.cloudinary.com/dwqdhp70e/image/upload/v1748538158/vjbcvodbfw6y33b9zckq.png"
    }
  },
  {
    _id: "683d7081e00737f09c33e470",
    title: "המרצה למתמטיקה ממש מקצועי וברור!",
    body: "לקחתי קורס מתמטיקה להשלמת בגרויות ברמת 3 יחידות, הקורס מוקלט מראש כמובן אבל הכל מסודר לפי קטגוריות ושלבים ברורים להתקדמות בחומר כולל תרגולים לכל פרק, המרצה שמעלמד מסביר באופן מאוד ברור ונגיש למי שמגיע בלי רקע. מופתע לטובה וממליץ מאוד, בנוסף המחירים נגישים מאוד!",
    rating: 5,
    relatedUser: {
      name: "דני"
    },
    relatedWebsite: {
      name: "גול gool",
      url: "gool.co.il",
      logo: "https://res.cloudinary.com/dwqdhp70e/image/upload/v1748855858/pd90xowe9ze43aag8syv.png"
    }
  },
  {
    _id: "68a0ef2ae92ca3ad6371eaa7",
    title: "אוכל טעים ביתי ואיכותי",
    body: "בתור לא טבעוני, אני נהנה מאוד מאיכות האוכל והשירות כל פעם מחדש!! מומלץ מאוד",
    rating: 5,
    relatedUser: {
      name: "Sharon Mishayev"
    },
    relatedWebsite: {
      name: "טבע האוכל",
      url: "tevahaochel.online",
      logo: "https://res.cloudinary.com/dwqdhp70e/image/upload/v1748685831/ipxz10s0777npuogfa0s.avif"
    }
  },
  {
    _id: "68a047bc6e9b6386beb12a63",
    title: "שירות מעולה",
    body: "חומרים אמינים הכל מגיע בזמן והמחירים הוגנים ממליץ למי שגרה באיזור וצריכה חומרים זמינים",
    rating: 4,
    relatedUser: {
      name: "נהוראי ס"
    },
    relatedWebsite: {
      name: "א.ב ציפורניים",
      url: "abnails.co.il",
      logo: "https://res.cloudinary.com/dwqdhp70e/image/upload/v1750789358/avubvhrxubhllid7eohw.png"
    }
  }
];

export function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === reviewsData.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextReview = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === reviewsData.length - 1 ? 0 : prevIndex + 1
      );
      setIsVisible(true);
    }, 300);
  };

  const prevReview = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? reviewsData.length - 1 : prevIndex - 1
      );
      setIsVisible(true);
    }, 300);
  };

  const goToReview = (index: number) => {
    if (index !== currentIndex) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsVisible(true);
      }, 300);
    }
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const currentReview = reviewsData[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-blue-50/50 to-purple-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-slow-pulse" />
        <div className="absolute bottom-1/4 left-10 w-24 h-24 bg-blue-500/15 rounded-full blur-2xl animate-float" />
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 relative">
        

        {/* Carousel Container */}
        <div className="relative max-w-3xl mx-auto">
          {/* Main Review Card */}
          <Card className={`h-80 shadow-xl border-2 transition-all duration-500 bg-white overflow-hidden ${
            isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
          }`}>
            <Link href={`/tool/${currentReview.relatedWebsite.url}`} className="block group h-full flex flex-col">
              
              {/* Business Header */}
              <div className="px-4 py-3 bg-primary/5 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentReview.relatedWebsite.logo && (
                      <div className="w-8 h-8 relative rounded overflow-hidden border border-gray-200 bg-white">
                        <Image
                          src={currentReview.relatedWebsite.logo}
                          alt={`${currentReview.relatedWebsite.name} logo`}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                      ביקורת על: {currentReview.relatedWebsite.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    לחץ לצפייה בעסק
                  </span>
                </div>
              </div>

              {/* Header Section with User Info and Rating */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-border">
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {currentReview.relatedUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>

                  {/* User Name and Verification */}
                  <div>
                    <div className="font-medium text-sm">
                      {currentReview.relatedUser.name}
                      <span className="inline-flex items-center gap-1 text-emerald-500 mr-2">
                        <span className="text-xs font-medium">מאומת</span>
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      16 באוג׳ 2025
                    </div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex">
                  <RatingTiles
                    value={currentReview.rating}
                    size={22}
                    starFontSize={16}
                    gap={2}
                    emptyColor="#e5e7eb"
                    tileRadius={2}
                    useDynamicColor
                  />
                </div>
              </div>

              {/* Review Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                  {currentReview.title}
                </h3>
                <p className="text-gray-700 leading-relaxed flex-1 overflow-hidden">
                  <span className="md:hidden">
                    {truncateText(currentReview.body, 160)}
                  </span>
                  <span className="hidden md:block">
                    {currentReview.body}
                  </span>
                </p>
              </div>
            </Link>
          </Card>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={nextReview}
            className="absolute -left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-xl bg-white/95 backdrop-blur-sm hover:bg-white border-2 hover:border-primary/30 transition-all hover:scale-110 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={prevReview}
            className="absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-xl bg-white/95 backdrop-blur-sm hover:bg-white border-2 hover:border-primary/30 transition-all hover:scale-110 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-3 mt-12">
          {reviewsData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToReview(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary scale-125 shadow-lg"
                  : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
              }`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link href="/business/register">
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-bold px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              הצטרפו לעסקים המובילים ברייט-איט
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            רישום חינם • ללא התחייבות • תוצאות מיידיות
          </p>
        </div>
      </div>
    </section>
  );
}
