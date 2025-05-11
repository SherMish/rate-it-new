"use client";

import { Shield, Filter, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MarketingSection() {
  const handleExploreClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-16 pb-8 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-semibold">
            Real Reviews. Real Insights. Choose AI Tools With Confidence.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            All reviews on AI-Radar are credible, unbiased, and verified for authenticity. 
            No filtering or manipulation—just real feedback from real users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-secondary/50 backdrop-blur-sm p-6 border-border/50">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Credible Reviews</h3>
              <p className="text-muted-foreground">
                Each review is backed by user verification and proof, ensuring trustworthy insights.
              </p>
            </div>
          </Card>

          <Card className="bg-secondary/50 backdrop-blur-sm p-6 border-border/50">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Filter className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Unbiased Platform</h3>
              <p className="text-muted-foreground">
                AI-Radar doesn&apos;t filter or manipulate reviews—your decision is based on real-world experiences.
              </p>
            </div>
          </Card>

          <Card className="bg-secondary/50 backdrop-blur-sm p-6 border-border/50">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Find the Best Fit</h3>
              <p className="text-muted-foreground">
                Easily compare AI tools and make confident choices for your specific needs.
              </p>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="gradient-button"
            onClick={handleExploreClick}
          >
            Start Exploring AI Tools
          </Button>
        </div>
      </div>
    </div>
  );
} 