"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function LatestToolsContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="space-y-6 text-right">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-4">
          היה בחזית.
          <br />
          ייעל תהליכי עבודה.
          <br />
          צמח בחוכמה.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          שחרר את פתרונות הבינה המלאכותית החדשניים שעוצבו כדי לקדם יעילות,
          חדשנות וצמיחה. מאוטומציה ועד ניתוח מתקדם, חקור כלים מתקדמים שיכולים
          להעניק לעסק שלך יתרון תחרותי.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5, delay: 0.2 }}
        variants={fadeInUp}
      >
        <p className="text-muted-foreground text-lg">
          רוצה להציג את פתרון הבינה המלאכותית שלך?{" "}
          <Link
            href="/business/register"
            className="text-primary hover:text-primary/90 hover:underline transition-colors"
          >
            רשום אותו היום בחינם
          </Link>{" "}
          והגיע למקצוענים המחפשים את החדשנות הבאה.
        </p>
      </motion.div>
    </div>
  );
}
