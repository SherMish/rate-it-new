"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  ArrowRight,
  Quote,
  Sparkles,
  Bot,
  Radar as RadarIcon,
  Star,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { AnimatedWord } from "@/components/ui/animated-word";
import { Card } from "@/components/ui/card";
import { fetchLatestWebsites } from "@/app/actions/website";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { formatPricingModel } from "@/lib/utils/formatting";
import { RadarTrustContent } from "../components/radar-trust-content";
import { RadarTrustVisual } from "../components/radar-trust-visual";

const benefits = [
  {
    title: "הגדילו את החשיפה",
    description:
      "גלו על ידי לקוחות פוטנציאליים המחפשים באופן פעיל עסקים כמו שלכם",
    icon: Search,
  },
  {
    title: "בנו אמון",
    description: "אספו והציגו ביקורות משתמשים מאומתות כדי לחזק את האמינות שלכם",
    icon: CheckCircle2,
  },
  {
    title: "פנו ללקוחות",
    description: "הגיבו לביקורות, הציגו עדכונים, ותקשרו עם לקוחות פוטנציאליים",
    icon: ArrowRight,
  },
  {
    title: "נתונים ותובנות",
    description: "קבלו גישה לאנליטיקות על מעורבות משתמשים, מגמות שוק ומתחרים",
    icon: ArrowRight,
  },
];

const steps = [
  {
    title: "הצהירו על העסק שלכם",
    description: "אמתו את הבעלות שלכם ועדכנו את הפרופיל שלכם",
  },
  {
    title: "שפרו את הרישום שלכם",
    description: "הוסיפו פרטים חשובים, תכונות ומחירים כדי למשוך משתמשים",
  },
  {
    title: "קבלו ביקורות ומשוב",
    description: "עודדו משתמשים להשאיר ביקורות כדי לשפר את האמון והאמינות",
  },
  {
    title: "עקבו אחר ביצועים",
    description:
      "עקבו אחר מעורבות, משוב משתמשים ומגמות שוק באמצעות לוח המחוונים שלנו",
  },
];

const trustedCompanies = [
  { name: "עסק א'", logo: "א" },
  { name: "עסק ב'", logo: "ב" },
  { name: "עסק ג'", logo: "ג" },
  { name: "עסק ד'", logo: "ד" },
  { name: "עסק ה'", logo: "ה" },
  { name: "עסק ו'", logo: "ו" },
];

const testimonials = [
  {
    quote:
      "הפלטפורמה הייתה כלי חיוני בעזרה לנו להבין את צרכי הלקוחות שלנו ולשפר את המוצר שלנו. התובנות שהשגנו הן ללא תחליף.",
    author: "שרה כהן",
    role: "מנהלת מוצר בחברת TechBiz",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    quote:
      "איכות המשוב והמעורבות מהקהילה עלתה על הציפיות שלנו. זה הפך לחלק חיוני באסטרטגיית הצמיחה שלנו.",
    author: "מיכאל רוזנברג",
    role: 'מנכ"ל BusinessPro',
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
];

interface Tool {
  _id: string;
  name: string;
  url: string;
  description?: string;
  shortDescription?: string;
  logo?: string;
  averageRating: number;
  reviewCount: number;
  radarTrust?: number;
  businessModel?: string;
}

// Add an interface for Website
interface Website {
  id: string;
  name: string;
  url: string;
  description?: string;
  shortDescription?: string;
  logo?: string;
  averageRating?: number;
  reviewCount?: number;
  radarTrust?: number;
}

function useCountUp(
  end: number,
  duration: number = 1000,
  decimals: number = 0
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      setCount(progress * end);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  return decimals === 0 ? Math.floor(count) : count.toFixed(decimals);
}

function GrowthIndicator({
  value,
  delay = 1500,
}: {
  value: number;
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`text-xs text-emerald-500 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      ↑ {value}%
    </div>
  );
}

export default function BusinessPage() {
  const router = useRouter();
  const [latestTools, setLatestTools] = useState<Tool[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");

  useEffect(() => {
    const getWebsites = async () => {
      try {
        const websites = await fetchLatestWebsites(10);

        // Transform websites to match Tool interface
        const toolsData = websites.map((website) => ({
          _id: website._id.toString(),
          name: website.name,
          url: website.url,
          shortDescription:
            website.shortDescription || website.description?.substring(0, 100),
          logo: website.logo,
          averageRating: website.averageRating || 0,
          reviewCount: website.reviewCount || 0,
          radarTrust: website.radarTrust || 0,
          businessModel: formatPricingModel(website.pricingModel || "Free"),
        }));

        setLatestTools(toolsData);
      } catch (error) {
        console.error("Failed to fetch websites:", error);
        // Use fallback data
        setLatestTools([
          {
            _id: "1",
            name: "עסק לדוגמה 1",
            url: "example-business1.co.il",
            shortDescription:
              "עסק מוביל בתחום עם שירות איכותי ומחירים תחרותיים",
            averageRating: 4.8,
            reviewCount: 1250,
            radarTrust: 9.2,
            businessModel: "פרימיום",
          },
          {
            _id: "2",
            name: "עסק לדוגמה 2",
            url: "example-business2.co.il",
            shortDescription:
              "מתמחים במתן פתרונות יצירתיים ומותאמים אישית ללקוחות",
            averageRating: 4.6,
            reviewCount: 890,
            radarTrust: 8.9,
            businessModel: "מנוי חודשי",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    getWebsites();
  }, []);

  const handleUrlSubmit = () => {
    if (websiteUrl) {
      // Store URL in localStorage with the correct key and format
      localStorage.setItem(
        "businessRegistration",
        JSON.stringify({ websiteUrl: websiteUrl })
      );

      // Redirect to registration page
      router.push(`/business/register`);
    }
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Background effects - match main page */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f620,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Right Column - Content */}
            <div className="text-right space-y-8" dir="rtl">
              <h1 className="text-4xl md:text-5xl font-bold">
                שדרגו את <AnimatedWord /> <br /> של העסק שלכם בעזרת רייט-איט
              </h1>
              <p className="text-xl text-muted-foreground">
              קבלו שליטה על איך הלקוחות רואים אתכם – הצטרפו והתחילו לבנות מוניטין חיובי.

              </p>
              <Button
                size="lg"
                className="gradient-button"
                onClick={() => router.push("/business/register")}
              >
                הירשמו בחינם עכשיו
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </div>

            {/* Left Column - Graphic */}
            <div className="relative aspect-square md:aspect-auto md:h-[500px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-border/50 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full max-w-[90%] md:max-w-[80%] aspect-square">
                    {/* Floating Elements */}
                    <div className="absolute top-0 right-[10%] w-20 h-20 bg-primary/20 rounded-lg animate-float-diagonal" />
                    <div className="absolute top-[20%] left-[10%] w-16 h-16 bg-secondary/20 rounded-full animate-float-right" />
                    <div className="absolute bottom-[20%] right-[20%] w-24 h-24 bg-blue-500/20 rounded-lg rotate-45 animate-float-left" />

                    {/* Central Element - Adjust sizing for mobile */}
                    <div className="absolute inset-[10%] md:inset-[20%] bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl p-4 md:p-6">
                      <div className="h-full flex flex-col">
                        {/* Analytics Header - Adjust spacing for mobile */}
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center relative group">
                              <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary absolute group-hover:opacity-0 transition-opacity" />
                              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary absolute opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-sm md:text-base">
                                העסק שלכם
                              </div>
                              <div className="text-xs md:text-sm text-muted-foreground">
                                30 הימים האחרונים
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid - Adjust spacing and text sizes for mobile */}
                        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
                          <div className="bg-background/50 rounded-lg p-2 md:p-3">
                            <div className="text-xs md:text-sm text-muted-foreground text-right">
                              צפיות בעמוד
                            </div>
                            <div className="text-lg md:text-2xl font-bold text-right">
                              {useCountUp(9752, 1500)}
                            </div>
                            <div className="text-right">
                              <GrowthIndicator value={12} />
                            </div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-2 md:p-3">
                            <div className="text-xs md:text-sm text-muted-foreground text-right">
                              המרות
                            </div>
                            <div className="text-lg md:text-2xl font-bold text-right">
                              {useCountUp(1239, 1500)}
                            </div>
                            <div className="text-right">
                              <GrowthIndicator value={26} />
                            </div>
                          </div>
                        </div>

                        {/* Trust Score - Adjust spacing and text sizes for mobile */}
                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1 text-primary">
                              <span className="text-xs md:text-sm font-medium">
                                דירוג אמון
                              </span>
                              <RadarIcon className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                            <div className="text-xs md:text-sm text-primary">
                              {useCountUp(9.1, 1500, 1)}
                            </div>
                          </div>
                          <div className="h-1.5 md:h-2 rounded-full bg-background overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-[1500ms]"
                              style={{ width: `${useCountUp(91, 1500)}%` }}
                            />
                          </div>
                          <div className="mt-1 md:mt-2 text-[10px] md:text-xs text-muted-foreground text-right">
                            העסק שלכם בין 9% העליונים
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Floating Elements */}
                    <div className="absolute bottom-[10%] left-[15%] w-12 h-12 bg-purple-500/20 rounded-full animate-float" />
                    <div className="absolute top-[40%] right-[5%] w-14 h-14 bg-pink-500/20 rounded-lg rotate-12 animate-float-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Search Tool Section */}
      <section className="relative py-16 bg-gradient-to-tr from-primary/20 via-blue-600/20 to-purple-700/25 border-y-2 border-primary/30 shadow-inner">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(circle_at_30%_40%,#3b82f640,transparent_30%)]"></div>
          <div className="absolute right-0 bottom-0 w-full h-full bg-[radial-gradient(circle_at_70%_60%,#6366f730,transparent_25%)]"></div>
          <div className="absolute left-1/4 top-0 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute right-1/4 bottom-0 translate-x-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-block px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg shadow-primary/10 mb-4">
              <p className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                עזרו ללקוחות למצוא אתכם - הוסיפו את העסק שלכם עכשיו
              </p>
            </div>

            <div className="relative max-w-xl mx-auto p-8 bg-white backdrop-blur-xl rounded-xl border-2 border-primary/20 shadow-xl">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-primary text-white font-bold rounded-full shadow-lg">
                שלב 1: הזינו את כתובת האתר שלכם
              </div>

              <div className="relative mt-4">
                <Input
                  type="url"
                  placeholder="הזינו את כתובת האתר שלכם"
                  className="h-14 pr-5 pl-36 text-lg bg-white/80 border-2 border-primary/30 focus:border-primary/70 shadow-inner"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUrlSubmit();
                    }
                  }}
                  dir="rtl"
                />
                <Button
                  className="absolute left-2 top-2 h-10 px-8 text-base bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-md hover:shadow-primary/20 transition-all"
                  onClick={handleUrlSubmit}
                >
                  הוסיפו עכשיו
                </Button>
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                לדוגמה: www.your-business.co.il
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                <div className="flex items-center p-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2 text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-sm font-medium">
                    הגדילו את החשיפה שלכם
                  </span>
                </div>
                <div className="flex items-center p-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2 text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-sm font-medium">
                    נהלו את המוניטין שלכם
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Section */}
      <section className="relative py-24 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-foreground">
                קחו שליטה על המוניטין שלכם.
              </span>{" "}
              <span className="inline-block px-2 py-1 bg-primary text-white rounded-md transform shadow-md font-extrabold mt-2">
                צמחו מהר יותר
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              קחו שליטה על הנוכחות של העסק שלכם באתר. תקשרו עם לקוחות, הגיבו
              למשוב, והציגו את היתרונות שלכם לאלפי לקוחות פוטנציאליים.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">פרופיל מאומת</h3>
              <p className="text-muted-foreground">
                קבלו תג מאומת, התאימו אישית את הרישום שלכם, ושמרו על מידע מדויק
                אודות העסק שלכם.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <RadarIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ניהול ביקורות</h3>
              <p className="text-muted-foreground">
                הגיבו לביקורות, אספו משוב, ובנו אמון עם תקשורת שקופה עם הלקוחות
                שלכם.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">אנליטיקת צמיחה</h3>
              <p className="text-muted-foreground">
                קבלו גישה לתובנות מפורטות על הביצועים שלכם, מעורבות משתמשים,
                ומיקום בשוק.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Listings Section */}
      <section className="relative py-24 bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              העסקים המובילים באתר שלנו
            </h2>

            <div className="max-w-full mx-auto">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="rounded-xl"
                dir="rtl"
              >
                {latestTools.map((tool) => (
                  <SwiperSlide key={tool._id}>
                    <Card
                      className="p-4 bg-white border-border shadow-sm h-[230px] flex flex-col cursor-pointer hover:bg-blue-50/50 transition-colors"
                      onClick={() => router.push(`/tool/${tool.url}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary/50 border border-border flex items-center justify-center overflow-hidden">
                          {tool.logo ? (
                            <Image
                              src={tool.logo}
                              alt={tool.name}
                              width={28}
                              height={28}
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-xs text-primary">
                                {tool.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <h3 className="text-base font-semibold text-foreground truncate">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {tool.url}
                          </p>
                        </div>

                        {/* Move RadarTrust to more prominent position */}
                        {tool.radarTrust && (
                          <div className="flex items-center px-2 py-1 bg-primary/10 rounded-lg border border-primary/20">
                            <span className="text-xs font-medium text-primary ml-1">
                              {tool.radarTrust}
                            </span>
                            <RadarIcon className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-medium text-primary mr-1">
                              דירוג אמון
                            </span>
                          </div>
                        )}
                      </div>

                      {tool.shortDescription && (
                        <div className="mt-3 space-y-1">
                          <p className="text-sm text-muted-foreground line-clamp-2 text-right">
                            {tool.shortDescription}
                          </p>
                          {/* Show business model with proper formatting */}
                          {tool.businessModel && (
                            <div className="flex items-center justify-end">
                              <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                                {tool.businessModel}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-auto pt-3">
                        <div className="flex items-center justify-end">
                          {tool.reviewCount > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {tool.averageRating.toFixed(1)} (
                                {tool.reviewCount})
                              </span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < tool.averageRating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-secondary"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              אין ביקורות עדיין
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* TrustRadar Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-[400px,1fr] gap-12 items-center">
            {/* Right Column - Visual */}
            <div>
              <RadarTrustVisual />
            </div>

            {/* Left Column - Content */}
            <div className="text-right">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  בנו <span className="text-primary">אמון</span> עם לקוחות
                  פוטנציאליים
                </h2>
                <p className="text-lg text-muted-foreground">
                  לקוחות מחפשים עסקים אמינים. באמצעות מערכת דירוג האמון החדשנית
                  שלנו, תוכלו להציג את האמינות והמקצועיות של העסק שלכם.
                </p>
                <p className="text-lg text-muted-foreground">
                  העסקים שלנו בעלי הדירוג הגבוה ביותר נהנים מיותר המרות, יותר
                  לקוחות חוזרים ויותר המלצות.
                </p>

                <Button
                  className="gradient-button"
                  size="lg"
                  onClick={() => router.push("/business/register")}
                >
                  הצטרפו עכשיו
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Marketing Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/15 to-purple-500/15 backdrop-blur-sm border-y border-primary/20">
        <div className="container mx-auto px-4">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-[120px]" />
            <div className="absolute top-2/3 right-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                מקסמו את ההשקעה שלכם
              </h2>
              <p className="text-xl text-foreground max-w-3xl mx-auto">
                הצטרפו למאות העסקים שהאיצו את הצמיחה שלהם על ידי הפיכה למאומתים
                באתר שלנו
              </p>
            </div>

            {/* ROI Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <div className="bg-white/90 backdrop-blur-xl border-2 border-primary/30 rounded-xl p-8 shadow-xl shadow-primary/5 text-center hover:border-primary/60 hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-6xl font-extrabold mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  3.4x
                </h3>
                <p className="text-xl mb-3 font-bold text-foreground">
                  תשואה להשקעה
                </p>
                <p className="text-muted-foreground font-medium">
                  תשואה ממוצעת על השקעה בתוך 6 חודשים ראשונים
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border-2 border-primary/30 rounded-xl p-8 shadow-xl shadow-primary/5 text-center hover:border-primary/60 hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  8K+
                </h3>
                <p className="text-xl mb-3 font-bold text-foreground">
                  לידים איכותיים
                </p>
                <p className="text-muted-foreground font-medium">
                  עסקים מקבלים חשיפה למקבלי החלטות וקונים פוטנציאליים
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border-2 border-primary/30 rounded-xl p-8 shadow-xl shadow-primary/5 text-center hover:border-primary/60 hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-6xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 to-primary bg-clip-text text-transparent">
                  32%
                </h3>
                <p className="text-xl mb-3 font-bold text-foreground">
                  יותר המרות
                </p>
                <p className="text-muted-foreground font-medium">
                  בהשוואה לערוצי שיווק רגילים לעסקים
                </p>
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="bg-white/90 backdrop-blur-xl border-2 border-primary/30 rounded-xl p-8 md:p-12 shadow-2xl shadow-primary/10">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                <div className="text-right">
                  <h3 className="text-3xl font-bold mb-8 text-foreground">
                    הזדמנויות צמיחה
                  </h3>
                  <p className="text-lg text-foreground mb-8">
                    עסקים המוצגים באתר שלנו חווים יתרונות רבים בכל משפך השיווק
                    והמכירות שלהם. הפלטפורמה שלנו עוזרת לחבר את העסק שלכם עם
                    הקהל הנכון של מחפשי שירותים:
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold text-xl mb-3 text-primary">
                        חשיפה מוגברת
                      </h4>
                      <div className="flex justify-between items-center border-b-2 border-primary/20 pb-3">
                        <span className="font-bold text-lg text-foreground">
                          משמעותית
                        </span>
                        <span className="text-foreground text-lg">
                          חשיפה ממוקדת למחפשי שירותים
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xl mb-3 text-blue-500">
                        אינטראקציות איכותיות
                      </h4>
                      <div className="flex justify-between items-center border-b-2 border-blue-500/20 pb-3">
                        <span className="font-bold text-lg text-foreground">
                          משופרות
                        </span>
                        <span className="text-foreground text-lg">
                          משתמשים בעלי כוונה גבוהה יותר לרכישה
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xl mb-3 text-purple-600">
                        צמיחה עסקית
                      </h4>
                      <div className="flex justify-between items-center border-b-2 border-purple-600/20 pb-3">
                        <span className="font-bold text-lg text-foreground">
                          מואצת
                        </span>
                        <span className="text-foreground text-lg">
                          המרה מהתעניינות להזדמנות עסקית
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 p-10 rounded-xl border-2 border-primary/30 shadow-xl">
                    <h4 className="text-2xl font-bold mb-6 text-right text-foreground">
                      הצעת הערך שלנו
                    </h4>

                    <div className="mb-10 text-right">
                      <div className="text-base font-medium text-primary mb-1">
                        קהל יעד:
                      </div>
                      <div className="text-xl font-bold">
                        מקבלי החלטות המחפשים שירותים ומוצרים
                      </div>
                    </div>

                    <div className="mb-10 text-right">
                      <div className="text-base font-medium text-primary mb-1">
                        תוצאת ההשקעה:
                      </div>
                      <div className="text-4xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                        צמיחה עסקית מובלת הכנסות
                      </div>
                      <div className="text-base text-foreground font-medium">
                        בססו את העסק שלכם כפתרון מהימן בשוק
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <a
                        href="/business/register"
                        className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white text-lg bg-gradient-to-r from-primary to-purple-600 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-1"
                      >
                        הגדילו את העסק שלכם עכשיו
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-20 text-center">
              <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-10 border-2 border-primary/20 shadow-xl shadow-primary/5 max-w-4xl mx-auto">
                <div className="absolute top-0 left-8 transform -translate-y-1/2 text-6xl text-primary opacity-50">
                  &ldquo;
                </div>
                <div className="absolute bottom-0 right-8 transform translate-y-1/3 text-6xl text-primary opacity-50">
                  &rdquo;
                </div>
                <blockquote className="italic text-2xl font-medium text-foreground">
                  הדירוג באתר נתן לעסק שלנו את האמינות שלה היה זקוק. תוך חודשים,
                  ראינו עלייה משמעותית בלידים איכותיים, והנראות שלנו בשוק השתפרה
                  באופן דרמטי
                </blockquote>
                <footer className="mt-6">
                  <p className="text-lg font-bold text-primary">
                    אלכס ריברה, מייסד ומנכ״ל
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">איך זה עובד</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm"
              >
                <div className="text-4xl font-bold text-primary mb-4">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button
              size="lg"
              className="gradient-button"
              onClick={() => router.push("/business/register")}
            >
              רשמו את העסק שלכם
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-secondary/50 backdrop-blur-sm border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              למה להצטרף לפלטפורמה שלנו?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-32 h-20 rounded-2xl bg-primary/10 mb-2">
                  <div className="text-4xl font-bold text-primary">10K+</div>
                </div>
                <h3 className="text-xl font-semibold">מבקרים חודשיים</h3>
                <p className="text-muted-foreground">
                  קבלו חשיפה לאלפי אנשי מקצוע המחפשים שירותים כמו שלכם
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-32 h-20 rounded-2xl bg-primary/10 mb-2">
                  <div className="text-4xl font-bold text-primary">200%</div>
                </div>
                <h3 className="text-xl font-semibold"> גידול בנראות של העסק</h3>
                <p className="text-muted-foreground">
                  עסקים מאומתים רואים עלייה משמעותית באינטראקציות עם לקוחות
                  והמרות
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-32 h-20 rounded-2xl bg-primary/10 mb-2">
                  <div className="text-4xl font-bold text-primary">500+</div>
                </div>
                <h3 className="text-xl font-semibold">עסקים</h3>
                <p className="text-muted-foreground">
                  הצטרפו לרשת הולכת וגדלה של עסקים המנצלים את הפלטפורמה שלנו
                  לשיפור הנראות
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20">
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold">
              הצטרפו היום וקדמו את העסק שלכם
            </h2>
            <p className="text-xl text-muted-foreground">
              התחילו לבנות אמון ואמינות עם הקהל שלכם כבר היום.
            </p>
            <Button
              size="lg"
              className="gradient-button"
              onClick={() => router.push("/business/register")}
            >
              רשמו את העסק שלכם בחינם
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
