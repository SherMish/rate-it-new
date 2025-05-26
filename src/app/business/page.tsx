"use client";

import { useState, useEffect, useRef } from "react";
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
  ArrowUp,
  ChevronDown,
  Plus,
  Minus,
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
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
    title: "פתחו פרופיל עסקי ברייט-איט",
    description:
      "אמתו את הבעלות על האתר שלכם והתחילו לבנות נוכחות אמינה מול לקוחות.",
  },
  {
    title: "שפרו את הפרופיל העסקי שלכם",
    description:
      " הוסיפו תיאור, שירותים, שעות פעילות ומחירים – כדי להפוך מבקרים ללקוחות.",
  },
  {
    title: " קבלו חוות דעת אמיתיות מלקוחות אמיתיים",
    description:
      "עודדו לקוחות מרוצים להשאיר ביקורות – זה מחזק אמון ומניע לפעולה.",
  },
  {
    title: "הפיקו יותר מהביקורות שלכם",
    description:
      "גשו לנתונים, נתחו תובנות ושפרו את הביצועים דרך לוח הבקרה שלנו.",
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

// Animations variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1], // Custom easing
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeInRightVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeInLeftVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden"
      variants={cardVariants}
    >
      <button
        className="w-full px-6 py-4 text-right flex items-center justify-between hover:bg-primary/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {isOpen ? (
            <Minus className="w-5 h-5 text-primary" />
          ) : (
            <Plus className="w-5 h-5 text-primary" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground text-right flex-1 mr-4">
          {question}
        </h3>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4 text-right">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BusinessPage() {
  const router = useRouter();
  const [latestTools, setLatestTools] = useState<Tool[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Refs for scroll animations
  const controlSectionRef = useRef<HTMLDivElement>(null);
  const trustRadarRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const marketingStatsRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const latestListingsRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);

  // Intersection observers
  const controlSectionInView = useScrollAnimation(controlSectionRef);
  const trustRadarInView = useScrollAnimation(trustRadarRef);
  const howItWorksInView = useScrollAnimation(howItWorksRef);
  const marketingStatsInView = useScrollAnimation(marketingStatsRef);
  const searchSectionInView = useScrollAnimation(searchSectionRef);
  const latestListingsInView = useScrollAnimation(latestListingsRef);
  const finalCtaInView = useScrollAnimation(finalCtaRef);

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

      {/* Hero Section - No scroll animation for first view */}
      <section className="relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />
        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Right Column - Content */}
            <motion.div
              className="text-right space-y-8"
              dir="rtl"
              variants={fadeInRightVariants}
            >
              <h1 className="text-4xl md:text-5xl font-bold">
                שדרגו את <AnimatedWord /> <br /> של העסק שלכם בעזרת רייט-איט
              </h1>
              <p className="text-xl text-muted-foreground">
                הפכו ביקורות אמיתיות לנכס שיווקי שמושך לקוחות חדשים.
              </p>
              <Button
                size="lg"
                className="gradient-button"
                onClick={() => router.push("/business/register")}
              >
                הירשמו בחינם עכשיו
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Left Column - Graphic */}
            <motion.div
              className="relative aspect-square md:aspect-auto md:h-[500px] rounded-lg overflow-hidden"
              variants={fadeInLeftVariants}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search Tool Section - Scroll animation */}
      <section
        ref={searchSectionRef}
        className="relative py-16 bg-gradient-to-tr from-primary/20 via-blue-600/20 to-purple-700/25 border-y-2 border-primary/30 shadow-inner"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(circle_at_30%_40%,#3b82f640,transparent_30%)]"></div>
          <div className="absolute right-0 bottom-0 w-full h-full bg-[radial-gradient(circle_at_70%_60%,#6366f730,transparent_25%)]"></div>
          <div className="absolute left-1/4 top-0 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute right-1/4 bottom-0 translate-x-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={searchSectionInView ? "visible" : "hidden"}
          >
            <motion.div
              className="inline-block px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg shadow-primary/10 mb-4"
              variants={itemVariants}
            >
              <p className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                עזרו ללקוחות למצוא אתכם - הוסיפו את העסק שלכם עכשיו
              </p>
            </motion.div>

            <motion.div
              className="relative max-w-xl mx-auto p-8 bg-white backdrop-blur-xl rounded-xl border-2 border-primary/20 shadow-xl"
              variants={itemVariants}
            >
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
                    נהלו פרופיל עסקי מקצועי
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Control Section - Scroll animation */}
      <section
        ref={controlSectionRef}
        className="relative py-24 bg-secondary/5"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate={controlSectionInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold"
              variants={itemVariants}
            >
              <span className="text-foreground">
                קחו שליטה על המוניטין שלכם.
              </span>{" "}
              <span className="inline-block px-2 py-1 bg-primary text-white rounded-md transform shadow-md font-extrabold mt-2">
                צמחו מהר יותר
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground"
              variants={itemVariants}
            >
              הלקוחות הישראלים הם לא פרייארים – הם בודקים, משווים ורוצים לראות
              ביקורות חיוביות מאנשים אמיתיים.
              <br />
              תנו להם לראות את מה שעושה אתכם טובים – ותזכו באמון שמוביל לפעולה{" "}
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={controlSectionInView ? "visible" : "hidden"}
          >
            <motion.div
              className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
              variants={cardVariants}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">פרופיל מאומת</h3>
              <p className="text-muted-foreground">
                קבלו תג מאומת, צרו נוכחות מקצועית, שדרו אמינות, והראו ללקוחות
                שאתם עסק איכותי.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
              variants={cardVariants}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <RadarIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ניהול ביקורות</h3>
              <p className="text-muted-foreground">
                הגיבו לביקורות, אספו פידבק אמיתי וצרו קשר מתמשך עם הקהל שלכם.{" "}
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
              variants={cardVariants}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <ArrowUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">דאשבורד ביצועים</h3>
              <p className="text-muted-foreground">
                קבלו גישה לתובנות מפורטות על הביצועים שלכם, מעורבות משתמשים,
                ומיקום בשוק.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Listings Section - Scroll animation */}
      <section
        ref={latestListingsRef}
        className="relative py-24 bg-secondary/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={latestListingsInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-16"
              variants={fadeInUpVariants}
            >
              העסקים האחרונים שהצטרפו לרייט-איט:
            </motion.h2>

            <motion.div
              className="max-w-full mx-auto"
              variants={fadeInUpVariants}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section - Scroll animation */}
      <section ref={howItWorksRef} className="relative py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUpVariants}
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
          >
            איך זה עובד
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm"
                variants={cardVariants}
                custom={index}
              >
                <div className="text-4xl font-bold text-primary mb-4">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            variants={fadeInUpVariants}
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
          >
            <Button
              size="lg"
              className="gradient-button"
              onClick={() => router.push("/business/register")}
            >
              רשמו את העסק שלכם
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* TrustRadar Section - Scroll animation */}
      <section ref={trustRadarRef} className="py-24 relative overflow-hidden">
        {/* Add decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl"></div>
        </div>

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          {/* Decorative line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block"></div>

          <motion.div
            className="grid lg:grid-cols-[400px,1fr] gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate={trustRadarInView ? "visible" : "hidden"}
          >
            {/* Right Column - Visual */}
            <motion.div
              className="relative lg:order-1 order-2 flex justify-center items-center h-[300px]"
              variants={fadeInRightVariants}
            >
              {/* Background blobs */}
              <div className="absolute inset-0 w-72 h-72 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl animate-slow-pulse"></div>
              <div className="absolute w-40 h-40 rounded-full top-0 right-0 bg-blue-400/10 blur-2xl animate-float-diagonal"></div>
              <div className="absolute w-32 h-32 rounded-full bottom-0 left-0 bg-indigo-500/10 blur-2xl animate-float-left"></div>

              {/* Logo with enhanced floating animation */}
              <motion.div
                className="relative"
                variants={itemVariants}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 3, 0, -3, 0],
                }}
                transition={{
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: 0.6,
                }}
              >
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 -m-8 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-full blur-xl opacity-70 animate-pulse"></div>

                {/* Decorative circles */}
                <div className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-full animate-spin-slow"></div>
                <div className="absolute -inset-12 border border-primary/10 rounded-full"></div>

                {/* Logo */}
                <Image
                  src="/logo_icon.svg"
                  alt="Rate It Logo"
                  width={300}
                  height={300}
                  className="relative z-10 drop-shadow-xl"
                />
              </motion.div>
            </motion.div>

            {/* Left Column - Content */}
            <motion.div
              className="text-right lg:order-2 order-1"
              variants={fadeInLeftVariants}
            >
              <div className="space-y-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 shadow-xl">
                <h2 className="text-3xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    כל מה שצריך
                  </span>{" "}
                  כדי לבנות{" "}
                  <span className="relative">
                    <span className="text-primary">אמון</span>
                  </span>{" "}
                  - במקום אחד
                </h2>

                <ul className="space-y-5">
                  {[
                    "להשיב לביקורות של לקוחות ולבנות שיח פתוח ואמין.",
                    "להזמין לקוחות מרוצים להשאיר ביקורת בקלות ובמהירות.",
                    "להמיר לקוחות מתעניינים בעזרת ביקורות חיוביות שמחזקות אמון.",
                    "להציג את הביקורות שלכם באתר וברשתות ולהיראות עסק רציני ומומלץ.",
                  ].map((text, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start group"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 ml-4 group-hover:from-primary/30 group-hover:to-blue-500/30 transition-all duration-300">
                        <span className="text-primary group-hover:scale-110 transition-transform duration-300">
                          •
                        </span>
                      </div>
                      <span className="text-lg">{text}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button
                  className="gradient-button relative overflow-hidden group transition-all duration-300 transform hover:scale-105"
                  size="lg"
                  onClick={() => router.push("/business/register")}
                >
                  <span className="relative z-10 flex items-center">
                    הצטרפו עכשיו
                    <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-600/80 group-hover:from-primary group-hover:to-blue-600 transition-all duration-300"></span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ROI Marketing Section - Scroll animation */}
      <section
        ref={marketingStatsRef}
        className="relative py-20 bg-gradient-to-br from-primary/15 to-purple-500/15 backdrop-blur-sm border-y border-primary/20"
      >
        <div className="container mx-auto px-4">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-[120px]" />
            <div className="absolute top-2/3 right-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUpVariants}
              initial="hidden"
              animate={marketingStatsInView ? "visible" : "hidden"}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                למה להצטרף לרייט-איט?
              </h2>
              <p className="text-xl text-foreground max-w-3xl mx-auto">
                מאות עסקים מכל התחומים כבר הופכים ביקורות לאמון והמלצות לצמיחה –
                הצטרפו אליהם.
              </p>
            </motion.div>

            {/* ROI Stats */}
            <motion.div
              className="grid md:grid-cols-3 gap-8 mb-20"
              variants={containerVariants}
              initial="hidden"
              animate={marketingStatsInView ? "visible" : "hidden"}
            >
              <motion.div
                className="bg-white/90 backdrop-blur-xl border-2 border-primary/30 rounded-xl p-8 shadow-xl shadow-primary/5 text-center hover:border-primary/60 hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1"
                variants={cardVariants}
              >
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
                  2.2x
                </h3>
                <p className="text-xl mb-3 font-bold text-foreground">
                  שיפור ביחס ההמרה
                </p>
                <p className="text-muted-foreground font-medium">
                  בקרב לקוחות שהטמיעו את הוויידג'ט של רייט-איט בדף הנחיתה שלהם
                </p>
              </motion.div>

              <motion.div
                className="bg-white/90 backdrop-blur-xl border-2 border-primary/30 rounded-xl p-8 shadow-xl shadow-primary/5 text-center hover:border-primary/60 hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1"
                variants={cardVariants}
              >
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
                  מבקרים חודשיים
                </p>
                <p className="text-muted-foreground font-medium">
                  שהחליטו לחפש עסקים בדרך הבטוחה והשקופה ביותר
                </p>
              </motion.div>

              <motion.div
                className="bg-white/90 backdrop-blur-xl border-2 border-primary/30 rounded-xl p-8 shadow-xl shadow-primary/5 text-center hover:border-primary/60 hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1"
                variants={cardVariants}
              >
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
                  200%
                </h3>
                <p className="text-xl mb-3 font-bold text-foreground">
                  יותר חשיפה
                </p>
                <p className="text-muted-foreground font-medium">
                  לעסקים שעברו את האימות של רייט-איט
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                שאלות נפוצות
              </h2>
              <p className="text-xl text-muted-foreground">
                כל מה שרציתם לדעת על הצטרפות לרייט-איט
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                {
                  question: "האם השירות באמת חינמי?",
                  answer:
                    "כן! פתיחת פרופיל עסקי וקבלת ביקורות מלקוחות הן חינמיות לחלוטין. עסקים יכולים לנהל את הפרופיל, להזמין ביקורות ולהגיב – ללא עלות. קיימות גם תוכניות מתקדמות עם פיצ'רים נוספים לעסקים שרוצים למקסם את הנוכחות הדיגיטלית שלהם.",
                },
                {
                  question: "מי יכול להירשם לפלטפורמה?",
                  answer:
                    "כל עסק עם אתר אינטרנט פעיל ודומיין משלו יכול להירשם. אנחנו מאמתים בעלות על הדומיין כדי להבטיח אמינות – לכן עסקים שפועלים רק באינסטגרם, פייסבוק או ללא אתר – לא יכולים להירשם בשלב זה.",
                },
                {
                  question: "כמה זמן לוקח לאמת את העסק?",
                  answer:
                    "תהליך האימות בדרך כלל מהיר – עד 48 שעות. אנו בודקים שהדומיין שייך לעסק, ושהאתר פעיל ורלוונטי. לאחר האימות תקבלו תג 'מאומת' שמחזק את האמינות של הפרופיל שלכם.",
                },
                {
                  question: "איך אני מזמין לקוחות לכתוב ביקורות?",
                  answer:
                    "לאחר פתיחת הפרופיל תקבלו קישור ייעודי, שאותו תוכלו לשלוח ללקוחות מרוצים – במייל, וואטסאפ או כל ערוץ אחר. אנחנו גם מציעים ווידג'ט להטמעה באתר שלכם, כדי לאסוף ביקורות ישירות מהמבקרים.",
                },
                {
                  question: "מה אם אני מקבל ביקורת שלילית?",
                  answer:
                    "גם ביקורת שלילית יכולה לשרת אתכם. ניתן להגיב לכל ביקורת ולהראות כיצד טיפלתם במקרה. שקיפות ותגובה מקצועית מחזקות את האמון בכם בעיני לקוחות פוטנציאליים.",
                },
                {
                  question: "אפשר לערוך את פרטי העסק בפרופיל?",
                  answer:
                    "בוודאי. אתם יכולים לעדכן תיאור, קטגוריה, שעות פעילות, לוגו, תמונות, פרטי קשר ועוד. פרופיל מלא ומדויק מעלה את רמת האמון ומגביר את שיעור ההמרה.",
                },
                {
                  question: "איך רייט-איט עוזרת לי להגיע ללקוחות חדשים?",
                  answer:
                    "עסקים עם פרופיל מאומת וביקורות חיוביות בולטים יותר בתוצאות החיפוש בפלטפורמה. בנוסף, אתם יכולים לשתף את דף הביקורות שלכם ברשתות החברתיות, באתר העסק, או בקמפיינים שיווקיים כדי לחזק אמון ולשפר המרות.",
                },
              ].map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Scroll animation */}
      <section ref={finalCtaRef} className="relative py-20">
        <div className="relative container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={finalCtaInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-3xl font-bold"
              variants={fadeInUpVariants}
            >
              ביקורת אחת יכולה להפוך התלבטות להחלטה.{" "}
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground"
              variants={fadeInUpVariants}
            >
              התחילו לבנות אמון ושקיפות עם הקהל שלכם כבר היום.
            </motion.p>
            <motion.div variants={fadeInUpVariants}>
              <Button
                size="lg"
                className="gradient-button"
                onClick={() => router.push("/business/register")}
              >
                רשמו את העסק שלכם בחינם
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
