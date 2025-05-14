"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "החשיפה",
  "ההכנסות",
  "השקיפות",
  "האמינות",
  "הנוכחות",
  "המוניטין",
];

export function AnimatedWord() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative" dir="rtl">
      <span className="invisible">
        {words.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[currentIndex]}
          initial={{ y: 10, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          exit={{ y: -10, opacity: 0 }}
          className="absolute inset-0 flex items-center"
        >
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-semibold">
            {words[currentIndex]}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
