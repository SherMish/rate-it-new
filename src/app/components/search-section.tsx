"use client";

import { SearchInput } from "@/components/search-input";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

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

export function SearchSection() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-[30vh] relative overflow-visible">
      <div className="relative container mx-auto px-4 py-8 pb-4">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-4">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl text-white font-semibold font-medium tracking-tight"
            >
              מצא בינה מלאכותית{" "}
              <span className="relative inline-block">
                <span className="relative bg-clip-text via-primary ">
                  אמינה
                </span>
                <span className="absolute -bottom-1 right-0 left-0 h-[2px] bg-gradient-to-l from-transparent via-primary to-transparent" />
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground"
            >
              חקור את כלי הבינה המלאכותית הטובים ביותר, מדורגים על ידי משתמשים
              אמיתיים.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="relative">
            <SearchInput onSearch={handleSearch} />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center"
          >
            <Link href="/tool/new" className="group">
              <div className="text-muted-foreground hover:text-primary transition-colors">
                <span className="text-sm">
                  חסר כלי בינה מלאכותית? הוסף אותו בשניות!
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
