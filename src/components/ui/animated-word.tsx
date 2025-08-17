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
    <span className="inline-block relative min-w-fit" dir="rtl" style={{ overflow: 'visible' }}>
      <span className="invisible font-semibold" style={{ padding: '2px' }}>
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
          className="absolute top-0 left-0 w-full h-full flex items-center"
          style={{ overflow: 'visible', padding: '2px' }}
        >
          <span 
            className="font-semibold relative"
            style={{
              background: 'linear-gradient(to right, hsl(var(--primary)), rgb(147 51 234))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              padding: '1px 2px',
              margin: '-1px -2px'
            }}
          >
            {words[currentIndex]}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
