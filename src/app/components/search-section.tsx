"use client";

import { SearchInput } from "@/components/search-input";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99], // Custom easing curve
    },
  },
};

const shimmerVariants = {
  initial: { backgroundPosition: "0% 0%" },
  animate: {
    backgroundPosition: "100% 100%",
    transition: { repeat: Infinity, duration: 2.5, ease: "linear" },
  },
};

export function SearchSection() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-[70vh] w-full relative overflow-hidden">
      {/* Floating elements with animation */}
      <div className="absolute top-1/3 left-[15%] w-64 h-64 rounded-full bg-blue-600/20 blur-3xl animate-float-delayed"></div>
      <div className="absolute top-2/3 right-[10%] w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>

      {/* Additional animated background elements */}
      <div className="absolute top-1/4 right-[20%] w-48 h-48 rounded-full bg-purple-500/10 blur-3xl animate-float-diagonal"></div>
      <div className="absolute bottom-1/4 left-[25%] w-56 h-56 rounded-full bg-blue-400/10 blur-3xl animate-float-left"></div>
      <div className="absolute top-2/3 left-[40%] w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl animate-float-right"></div>

      <div className="relative w-full flex flex-col items-center justify-center min-h-[70vh] py-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main headline with animated underline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-3"
          >
            מצאו עסקים אמינים
            <br />
            בישראל
          </motion.h1>

          {/* Animated highlight */}
          <motion.div
            className="h-[6px] w-64 mx-auto mb-6 rounded-full"
            initial={{ opacity: 0, width: "40%" }}
            animate={{ opacity: 1, width: "30%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
              backgroundSize: "200% 100%",
            }}
            variants={shimmerVariants}
          />

          {/* Trust-building subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-foreground/80 mb-6 max-w-2xl mx-auto"
          >
            גלו עסקים, קראו ביקורות אמיתיות – ושתפו גם את החוויות שלכם
          </motion.p>

          {/* Premium search box with glow effect */}
          <motion.div
            variants={itemVariants}
            className="relative mx-auto max-w-2xl mb-8"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 animate-slow-pulse"></div>
            <div className="relative bg-background/90 backdrop-blur-sm rounded-lg p-1.5 shadow-xl border border-white/20">
              <SearchInput onSearch={handleSearch} />
            </div>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-8 mb-4"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5K+</div>
              <div className="text-sm text-foreground/60">משתמשים רשומים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-foreground/60">ביקורות מאומתות</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">3K+</div>
              <div className="text-sm text-foreground/60">עסקים מדורגים</div>
            </div>
          </motion.div>

          {/* Add business link */}
          <motion.div variants={itemVariants} className="mt-4">
            <Link href="/tool/new" className="group">
              <div className="text-foreground/60 hover:text-primary transition-colors font-medium">
                <span className="text-sm border-b border-dotted border-foreground/30 hover:border-primary pb-0.5">
                  העסק שחיפשתם לא מופיע? הוסיפו אותו בקלות
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
