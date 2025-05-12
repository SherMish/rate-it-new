"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Shield, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";
import { RadarTrustInfo } from "@/components/radar-trust-info";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function RadarTrustContent({ isBusiness }: { isBusiness?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!isBusiness) {
    return (
      <div ref={ref} className="space-y-6 text-right">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-primary">RadarTrust™</span>
            <br />
            סטנדרט האיכות של תעשיית הבינה המלאכותית
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            ציון ה-<strong>RadarTrust™</strong> הייחודי שלנו מאפשר לעסקים ואנשי
            מקצוע לקבל החלטות מבוססות נתונים בבחירת כלי בינה מלאכותית. אנו
            מנתחים גורמים מרכזיים כמו{" "}
            <strong>משוב משתמשים, חדשנות, אמינות ואימוץ שוק </strong>
            כדי להבטיח שתשקיעו בפתרונות היעילים והאמינים ביותר.
          </p>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              icon: Star,
              title: "ביקורות משתמשים ואמינות",
              description:
                "משוב אותנטי ודירוגים ממשתמשים אמיתיים שהתנסו בכלים באופן ישיר.",
              delay: 0.2,
            },
            {
              icon: Sparkles,
              title: "חדשנות ויתרון טכנולוגי",
              description:
                "הערכה של תכונות ייחודיות, התקדמות טכנולוגית ויכולות פתרון בעיות.",
              delay: 0.4,
            },
            {
              icon: Shield,
              title: "אמינות וביצועים",
              description:
                "בחינה מעמיקה של זמן פעילות, איכות תמיכה ויציבות לטווח ארוך, המבטיחה פעילות עסקית חלקה.",
              delay: 0.6,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 flex-row-reverse"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: item.delay }}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Business-Specific Content
  return (
    <div ref={ref} className="space-y-6 text-right">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-primary">RadarTrust™</span>
          <br />
          בנה אמון, השג נראות ובלוט מהשאר
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          תבע את הכלי שלך, בסס אמינות, וזכה להכרה כפתרון אמין בתעשיית הבינה
          המלאכותית. <strong>RadarTrust™</strong> משתמש בניתוח מתקדם מבוסס בינה
          מלאכותית להערכת כלים על בסיס{" "}
          <strong>משוב משתמשים, חדשנות, אמינות ואימוץ שוק</strong>, המסייע לאנשי
          מקצוע לגלות ולבטוח בפתרון שלך.
          <RadarTrustInfo>
            <span className="underline pr-2 cursor-pointer hover:text-primary hover:underline transition-colors ">
              למד עוד
            </span>
          </RadarTrustInfo>
        </p>
      </motion.div>

      <div className="space-y-4">
        {[
          {
            icon: CheckCircle,
            title: "תבע ואמת את כלי הבינה המלאכותית שלך",
            description:
              "תבע את הרישום שלך כדי לבסס אמינות ולהבטיח ייצוג מדויק של המוצר שלך.",
            delay: 0.2,
          },
          {
            icon: Star,
            title: "קבל ציון TrustRadar™",
            description:
              "הצג את אמינות כלי הבינה המלאכותית שלך עם ציון TrustRadar™ רשמי - בו בוטחים אנשי מקצוע.",
            delay: 0.4,
          },
          {
            icon: Sparkles,
            title: "שתף ושפר את הציון שלך",
            description:
              "עודד משוב אמיתי ממשתמשים והדגם שיפור מתמיד כדי לחזק את המוניטין שלך.",
            delay: 0.6,
          },
          {
            icon: Shield,
            title: "השג הכרה בשוק",
            description:
              "בלוט מבין המתחרים באמצעות מיצוב כלי הבינה המלאכותית שלך בשוק אמין ומותאם.",
            delay: 0.8,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4 flex-row-reverse"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: item.delay }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="flex flex-col gap-2 items-center">
        <Link
          href="/business/register"
          className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition"
        >
          Get Your TrustRadar™ Score
        </Link>
      </motion.div>
    </div>
  );
}
