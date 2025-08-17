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
  ArrowLeft,
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
import { ReviewsCarousel } from "@/components/reviews-carousel";

const steps = [
  {
    title: "פתחו פרופיל עסקי ברייט-איט",
    description:
      "אמתו את הבעלות על האתר שלכם והתחילו לבנות נוכחות אמינה מול לקוחות.",
  },
  {
    title: "הוסיפו מידע בסיסי על העסק",
    description:
      "כמה פרטים פשוטים יעזרו ללקוחות להכיר אתכם ולהבין איך אתם יכולים לעזור להם.",
  },
  {
    title: " קבלו חוות דעת אמיתיות מלקוחות אמיתיים",
    description:
      "עודדו לקוחות מרוצים להשאיר ביקורות – זה מחזק אמון ומניע לפעולה.",
  },
  {
    title: "צמחו מהר יותר עם ביקורות חיוביות",
    description:
      "השתמשו בביקורות לשיווק, שפרו את השירות על בסיס פידבק ומשכו לקוחות חדשים.",
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

      {/* Hero Section - Unified Background */}
      <section className="relative z-10">
        {/* Unified Hero Background - Connects all elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base gradient that spans the entire section */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-blue-500/5 to-purple-500/8" />

          {/* Connecting gradient between left and right */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Flowing background elements that connect both sides */}
          <div className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-primary/15 via-blue-500/10 to-purple-500/15 blur-3xl transform -skew-y-1" />
          <div className="absolute bottom-1/4 left-0 w-full h-24 bg-gradient-to-r from-purple-500/10 via-primary/8 to-blue-500/12 blur-3xl transform skew-y-1" />

          {/* Floating orbs that bridge the gap */}
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-slow-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-blue-500/15 rounded-full blur-2xl animate-float" />
          <div className="absolute top-2/3 left-1/2 w-20 h-20 bg-purple-500/12 rounded-full blur-xl animate-float-right" />
        </div>

        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          {/* Main Content Section - Single Column */}
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            dir="rtl"
          >
            {/* Main Title Content - No Card Background */}
            <motion.div className="space-y-8 py-8" variants={fadeInUpVariants}>
              <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                שדרגו את{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent italic">
                  <AnimatedWord />
                </span>{" "}
                <br /> של העסק שלכם בעזרת רייט-איט
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-medium mb-8">
                מערכת הביקורות שמגדילה אמון ורווחים לעסקים ישראליים
              </p>

              {/* Trust Indicators - Centered */}
              <div className="flex justify-center items-center gap-4 flex-wrap mb-8">
                <motion.div
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-lg px-6 py-4 rounded-xl shadow-lg border border-green-200/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-8 h-8 bg-green-100/70 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-green-700">
                    300+ עסקים כבר בוטחים בנו{" "}
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-lg px-6 py-4 rounded-xl shadow-lg border border-blue-200/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-8 h-8 bg-blue-100/70 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    4.8/5 שביעות רצון
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-lg px-6 py-4 rounded-xl shadow-lg border border-orange-200/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-8 h-8 bg-orange-100/70 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-bold text-orange-700">
                    ללא התחייבות
                  </span>
                </motion.div>
              </div>

              {/* CTA Button - Centered */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  size="lg"
                  className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all rounded-xl"
                  onClick={() => router.push("/business/register")}
                >
                  התחילו עכשיו בחינם <ArrowLeft className="mr-3 h-6 w-6" />
                </Button>
              </motion.div>
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
              className="inline-block px-8 py-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg shadow-primary/10 mb-8"
              variants={itemVariants}
            >
              <p className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                87% מהקונים בודקים ביקורות לפני הרכישה.
                <br />
                האם הם מוצאים ביקורות חיוביות על העסק שלכם?
              </p>
            </motion.div>

            <motion.div
              className="relative max-w-xl mx-auto p-6 md:p-8 bg-white/90 backdrop-blur-xl rounded-xl border-2 border-primary/20 shadow-xl"
              variants={itemVariants}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-primary text-white font-bold rounded-full shadow-lg text-sm md:text-base">
                שלב 1: הזינו את כתובת האתר שלכם
              </div>

              <div className="relative mt-6">
                {/* Desktop Layout */}
                <div className="hidden md:block">
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

                {/* Mobile Layout - Vertical */}
                <div className="md:hidden space-y-3">
                  <Input
                    type="url"
                    placeholder="הזינו את כתובת האתר שלכם"
                    className="h-12 px-4 text-base bg-white/80 border-2 border-primary/30 focus:border-primary/70 shadow-inner w-full"
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
                    className="w-full h-12 text-base bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-md hover:shadow-primary/20 transition-all"
                    onClick={handleUrlSubmit}
                  >
                    הוסיפו עכשיו
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground text-center">
                לדוגמה: www.your-business.co.il
              </div>

              {/* Benefits - Mobile Vertical, Desktop Horizontal */}
              <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                <div className="flex items-center p-2 gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2 text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-sm font-medium">
                    הגדילו את החשיפה שלכם
                  </span>
                </div>
                <div className="flex items-center p-2 gap-2">
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

      {/* Control Section - Enhanced with pricing page styling */}
      <section ref={controlSectionRef} className="relative py-24 bg-white">
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
              <span className="text-gray-900">קחו שליטה על המוניטין שלכם.</span>{" "}
              <span className="inline-block px-2 py-1 bg-primary text-white rounded-md transform shadow-md font-extrabold mt-2">
                צמחו מהר יותר
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-700 leading-relaxed"
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
              className="p-6 rounded-xl border-l-4 border-l-green-500 bg-white shadow-lg"
              variants={cardVariants}
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                פרופיל מאומת
              </h3>
              <p className="text-gray-700 leading-relaxed">
                קבלו תג מאומת, צרו נוכחות מקצועית, שדרו אמינות, והראו ללקוחות
                שאתם עסק איכותי.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border-l-4 border-l-blue-500 bg-white shadow-lg"
              variants={cardVariants}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <RadarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                ניהול ביקורות
              </h3>
              <p className="text-gray-700 leading-relaxed">
                הגיבו לביקורות, אספו פידבק אמיתי וצרו קשר מתמשך עם הקהל שלכם.{" "}
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border-l-4 border-l-purple-500 bg-white shadow-lg"
              variants={cardVariants}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <ArrowUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                דאשבורד ביצועים
              </h3>
              <p className="text-gray-700 leading-relaxed">
                קבלו גישה לתובנות מפורטות על הביצועים שלכם, מעורבות משתמשים,
                ומיקום בשוק.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Carousel Section */}
      <ReviewsCarousel />

      {/* How it Works Section - Enhanced with pricing page styling */}
      <section ref={howItWorksRef} className="relative py-20 bg-white">
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
                className={`p-6 rounded-xl bg-white shadow-lg border-l-4 ${
                  index === 0
                    ? "border-l-green-500"
                    : index === 1
                    ? "border-l-blue-500"
                    : index === 2
                    ? "border-l-purple-500"
                    : "border-l-orange-500"
                }`}
                variants={cardVariants}
                custom={index}
              >
                <div
                  className={`text-4xl font-bold mb-4 ${
                    index === 0
                      ? "text-green-600"
                      : index === 1
                      ? "text-blue-600"
                      : index === 2
                      ? "text-purple-600"
                      : "text-orange-600"
                  }`}
                >
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
              className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push("/business/register")}
            >
              רשמו את העסק שלכם
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Latest Listings Section - Scroll animation */}
      {/*       
      {/* כל מה שצריך כדי להגדיל מכירות Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-white to-slate-50/70">
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
            animate="visible"
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
                  כדי להגדיל{" "}
                  <span className="relative">
                    <span className="text-primary">מכירות</span>
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

      {/* Testimonials Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 border-y border-indigo-200/40 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/40 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              לקוחות מספרים
            </h2>
            <p className="text-muted-foreground mb-10">
              מה אומרים עלינו בעלי עסקים שהצטרפו ל-Rate-It
            </p>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                {
                  quote:
                    "חוויה מעולה! קל לאסוף ביקורות מלקוחות ולהציג אותן בצורה שמגדילה אמון והמרות.",
                  author: "יונת אבורוס",
                  role: "בעלת חנות אינטרנט בתחום המזון הטבעוני",
                  businessName: "טבע האוכל",
                  businessLogo:
                    "https://res.cloudinary.com/dwqdhp70e/image/upload/v1748685831/ipxz10s0777npuogfa0s.avif",
                },
                {
                  quote:
                    "הכי אהבתי שזה פשוט - לא צריך להיות מומחה טכנולוגיה. תוך שבוע כבר היו לנו ביקורות ראשונות, ועכשיו זה עובד אוטומטית. חוסך לי המון זמן.",
                  author: "אלי רוזן",
                  role: "בעל משרד לשירותי שיווק דיגיטלי",
                },
                {
                  quote:
                    "לקוחות שואלים אותי 'איך אני יודע שאתם אמינים?' - עכשיו יש לי תשובה. הביקורות ברייט-איט עושות את העבודה בשבילי. פחות שכנוע, יותר מכירות.",
                  author: "שרון גבע",
                  role: "יועצת עסקית, עובדת עצמאית",
                },
              ].map((t, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 md:p-7 mx-auto hover:scale-[1.02] hover:bg-white"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Prominent business header (if provided) */}
                  {(t as any).businessLogo || (t as any).businessName ? (
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {(t as any).businessLogo ? (
                        <Image
                          src={(t as any).businessLogo}
                          alt={(t as any).businessName || "לוגו העסק"}
                          width={44}
                          height={44}
                          className="rounded-lg border border-border object-contain bg-white w-11 h-11 p-1"
                        />
                      ) : null}
                      {(t as any).businessName ? (
                        <div className="text-lg font-semibold text-foreground">
                          {(t as any).businessName}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <div
                    className="flex justify-center mb-3"
                    aria-label="5 כוכבים"
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400 ml-1"
                      />
                    ))}
                  </div>
                  <div className="flex items-start justify-center gap-2 mb-2">
                    <Quote
                      className="w-6 h-6 text-primary/70 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-base leading-relaxed">{t.quote}</p>
                    <Quote
                      className="w-6 h-6 text-primary/70 mt-0.5 rotate-180 flex-shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <div className="font-semibold text-foreground">
                      {t.author}
                    </div>
                    <div>{t.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-50 to-gray-100/80 border-y border-border/40">
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
                    "כן! פתיחת פרופיל עסקי וקבלת ביקורות מלקוחות הן חינמיות לחלוטין. עסקים יכולים להזמין ביקורות, לנהל את הפרופיל ולהגיב – ללא עלות. למי שמעוניין ביותר חשיפה ואמון – יש לנו גם מסלול Plus עם תכונות מתקדמות, כולל תג 'עסק מאומת'.",
                },
                {
                  question: "מי יכול להירשם לפלטפורמה?",
                  answer:
                    "כל עסק עם אתר אינטרנט פעיל ודומיין משלו יכול להירשם. אנחנו מאמתים בעלות על הדומיין כדי להבטיח אמינות – לכן עסקים שפועלים רק באינסטגרם, פייסבוק או ללא אתר – לא יכולים להצטרף בשלב זה.",
                },
                {
                  question: "כמה זמן לוקח לאמת את העסק ולקבל תג 'מאומת'?",
                  answer:
                    "האימות מתבצע ידנית על ידי צוות Rate-It, ואורך עד 72 שעות מרגע ההרשמה למסלול Plus. אנחנו בודקים שהאתר פעיל, שהפרטים תואמים, ושקיים ייצוג אמיתי של העסק. לאחר האישור תופיע תווית 'עסק מאומת' בפרופיל שלכם.",
                },
                {
                  question: "איך אני מזמין לקוחות לכתוב ביקורות?",
                  answer:
                    "לאחר פתיחת הפרופיל תקבלו קישור אישי שאותו תוכלו לשלוח ללקוחות מרוצים – במייל, בוואטסאפ או בכל ערוץ אחר. בנוסף, ניתן להטמיע ווידג׳ט באתר שלכם לאיסוף ביקורות באופן ישיר מהמבקרים.",
                },
                {
                  question: "מה אם אני מקבל ביקורת שלילית?",
                  answer:
                    "גם ביקורת שלילית יכולה לשרת אתכם. אתם יכולים להגיב אליה, להסביר מה קרה, ולהראות איך טיפלתם במקרה. לקוחות מעריכים עסקים ששקופים ומגיבים באחריות.",
                },
                {
                  question: "אפשר לערוך את פרטי העסק בפרופיל?",
                  answer:
                    "בוודאי. אתם יכולים לעדכן תיאור, קטגוריה, שעות פעילות, תמונות, לוגו, פרטי קשר ועוד. פרופיל מלא ועדכני משדר רצינות ומגדיל את הסיכוי לפניות חדשות.",
                },
                {
                  question: "איך רייט-איט עוזרת לי להגיע ללקוחות חדשים?",
                  answer:
                    "עסקים עם ביקורות חיוביות ותג 'מאומת' מקבלים יותר חשיפה בפלטפורמה, מופיעים גבוה יותר בתוצאות, ומשדרים אמון מיידי. בנוסף, תוכלו לשתף את דף הביקורות שלכם באתר העסק וברשתות החברתיות – ככל שיותר לקוחות יראו, כך יגדל הסיכוי לפניות.",
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

      {/* Final CTA Section - Enhanced with pricing page styling */}
      <section
        ref={finalCtaRef}
        className="bg-gradient-to-r from-primary/10 via-blue-600/10 to-purple-700/15 py-16"
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={finalCtaInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-3xl font-bold mb-4"
              variants={fadeInUpVariants}
            >
              🚀 ביקורת אחת יכולה להפוך התלבטות להחלטה
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground mb-8"
              variants={fadeInUpVariants}
            >
              התחילו לבנות אמון ושקיפות עם הקהל שלכם כבר היום
            </motion.p>
            <motion.div variants={fadeInUpVariants}>
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                onClick={() => router.push("/business/register")}
              >
                רשמו את העסק שלכם בחינם
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                התחלה תוך 5 דקות • ביטול בכל עת • תמיכה 24/7
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
