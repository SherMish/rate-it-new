"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Basic",
    description: "Everything you need to get started with AI-Radar",
    price: "Free",
    features: [
      "Basic company profile",
      "Up to 10 reviews per month",
      "Basic analytics dashboard",
      "Community support",
      "Standard response time",
      "Email notifications",
    ],
    limitations: [
      "No review response",
      "No custom branding",
      "No priority support",
      "Limited analytics",
    ],
  },
  {
    name: "Professional",
    description: "Advanced features for growing AI businesses",
    price: {
      monthly: 49,
      annual: 470,
    },
    features: [
      "Enhanced company profile",
      "Unlimited reviews",
      "Advanced analytics dashboard",
      "Priority support",
      "Custom branding",
      "Review response",
      "API access",
      "Team collaboration",
      "Custom reports",
      "Dedicated account manager",
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const handlePlanSelection = (planName: string) => {
    if (planName === "Basic") {
      router.push("/business/dashboard");
    } else {
      router.push("/business/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Select the perfect plan for your AI business needs
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <span className={billingCycle === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"}>
              Monthly billing
            </span>
            <Switch
              checked={billingCycle === "annual"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
              className="data-[state=checked]:bg-primary"
            />
            <div className="flex items-center gap-2">
              <span className={billingCycle === "annual" ? "text-foreground font-medium" : "text-muted-foreground"}>
                Annual billing
              </span>
              <span className="text-xs text-primary font-medium px-2 py-1 rounded-full bg-primary/10">
                Save 20%
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-transform duration-200 hover:scale-105 ${
                  plan.name === "Professional"
                    ? "bg-secondary/50 backdrop-blur-sm border-primary/50"
                    : "bg-secondary/50 backdrop-blur-sm"
                }`}
              >
                {plan.name === "Professional" && (
                  <div className="absolute top-0 right-0">
                    <div className="text-xs font-medium px-3 py-1 bg-primary text-primary-foreground rounded-bl-lg">
                      RECOMMENDED
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      {typeof plan.price === "string"
                        ? plan.price
                        : `$${billingCycle === "monthly" ? plan.price.monthly : plan.price.annual}`}
                    </span>
                    {typeof plan.price !== "string" && (
                      <span className="text-muted-foreground ml-2">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations?.map((limitation) => (
                      <div key={limitation} className="flex items-center gap-2 text-muted-foreground">
                        <X className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.name === "Professional" ? "gradient-button" : ""
                    }`}
                    variant={plan.name === "Professional" ? "default" : "outline"}
                    size="lg"
                    onClick={() => handlePlanSelection(plan.name)}
                  >
                    Select {plan.name} Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Compare Plans */}
          <div className="mt-16 text-center">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={() => router.push("/business/compare-plans")}
            >
              Compare plans in detail →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}