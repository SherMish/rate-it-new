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
      <div ref={ref} className="space-y-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-primary">RadarTrust™</span>
            <br />
            The AI Industry&apos;s Benchmark for Quality
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Our proprietary <strong>RadarTrust™</strong> score empowers
            businesses and professionals to make data-driven decisions when
            selecting AI tools. We analyze key factors like{" "}
            <strong>
              user feedback, innovation, reliability, and market adoption{" "}
            </strong>
            to ensure you invest in the most effective and trustworthy
            solutions.
          </p>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              icon: Star,
              title: "User Reviews & Credibility",
              description:
                "Authentic feedback and ratings from real users who have experienced the tools firsthand.",
              delay: 0.2,
            },
            {
              icon: Sparkles,
              title: "Innovation & Technological Edge",
              description:
                "Assessment of unique features, technological advancement, and problem-solving capabilities.",
              delay: 0.4,
            },
            {
              icon: Shield,
              title: "Reliability & Performance",
              description:
                "A deep dive into uptime, support quality, and long-term stability, ensuring seamless business operations.",
              delay: 0.6,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: item.delay }}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
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
    <div ref={ref} className="space-y-6">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-primary">RadarTrust™</span>
          <br />
          Build Trust, Gain Visibility, and Stand Out
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          Claim your AI tool, establish credibility, and get recognized as a
          trusted solution in the AI industry. <strong>RadarTrust™</strong> uses
          advanced AI-driven analysis to evaluate tools based on{" "}
          <strong>
            user feedback, innovation, reliability, and market adoption
          </strong>
          , helping professionals discover and trust your solution.
          <RadarTrustInfo> 
            <span className="underline pl-2 cursor-pointer hover:text-primary hover:underline transition-colors ">
              Learn more
            </span>
          </RadarTrustInfo>
        </p>
      </motion.div>

      <div className="space-y-4">
        {[
          {
            icon: CheckCircle,
            title: "Claim & Verify Your AI Tool",
            description:
              "Claim your listing to establish credibility and ensure accurate representation of your product.",
            delay: 0.2,
          },
          {
            icon: Star,
            title: "Earn a TrustRadar™ Score",
            description:
              "Showcase your AI tool's reliability with an official TrustRadar™ Score—trusted by professionals.",
            delay: 0.4,
          },
          {
            icon: Sparkles,
            title: "Engage & Improve Your Score",
            description:
              "Encourage real user feedback and demonstrate continuous improvement to enhance your reputation.",
            delay: 0.6,
          },
          {
            icon: Shield,
            title: "Gain Market Recognition",
            description:
              "Stand out among competitors by positioning your AI tool in a trusted, curated marketplace.",
            delay: 0.8,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: item.delay }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
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
