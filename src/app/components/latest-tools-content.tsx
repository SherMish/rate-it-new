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
          אל תישארו מאחור.
          <br />
          תנו לעסק שלכם את המקום{" "}
          <span className="inline-block px-1 py-0.5 bg-primary text-white rounded-md transform -rotate-9 shadow-md font-extrabold">
            שמגיע לו
          </span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          ישראלים מחפשים עסקים אמינים – תנו להם למצוא אתכם עם דירוגים שקופים
          וחוות דעת אמיתיות. חזקו את הנוכחות הדיגיטלית שלכם, בנו אמון, והפכו
          למותג שכולם זוכרים וממליצים עליו.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5, delay: 0.2 }}
        variants={fadeInUp}
      >
        <p className="text-muted-foreground text-lg">
          רוצים שהעסק שלכם יופיע בפלטפורמה?{" "}
          <Link
            href="/business/register"
            className="text-primary hover:text-primary/90 hover:underline transition-colors"
          >
            הוסיפו אותו עכשיו בחינם
          </Link>{" "}
          ותנו ללקוחות הנכונים להגיע אליכם.{" "}
        </p>
      </motion.div>
    </div>
  );
}
