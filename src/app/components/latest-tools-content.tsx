'use client';

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function LatestToolsContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="space-y-6">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-4">
          Stay ahead.
          <br />
          Optimize workflows.
          <br />
          Scale smarter.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Unlock the latest AI solutions designed to drive
          efficiency, innovation, and growth. From automation to
          advanced analytics, explore cutting-edge tools that can
          give your business a competitive edge.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5, delay: 0.2 }}
        variants={fadeInUp}
      >
        <p className="text-muted-foreground text-lg">
          Want to feature your AI solution?{" "}
          <Link
            href="/business/register"
            className="text-primary hover:text-primary/90 hover:underline transition-colors"
          >
            List it today for free
          </Link>{" "}
          and reach professionals looking for the next big
          innovation.
        </p>
      </motion.div>
    </div>
  );
} 