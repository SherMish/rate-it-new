import { Building2, Users2, Target, Award, Shield, Globe, Sparkles, Scale, Heart, Zap, BookOpen, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8 rounded-lg border bg-card/50 backdrop-blur-xl p-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">About AI-Radar</h1>
            <p className="text-xl text-muted-foreground">
              Empowering informed decisions in the AI revolution
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              AI-Radar was founded with a vision to democratize access to AI tool information. In a rapidly evolving landscape where new AI solutions emerge daily, we serve as your trusted navigator, helping individuals and organizations make informed decisions through authentic user experiences and comprehensive evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Shield className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Trust & Transparency</h3>
              <p className="text-muted-foreground">
                We believe in complete transparency in our review process. Every rating and review on our platform comes from verified users sharing their authentic experiences.
              </p>
            </div>
            
            <div className="space-y-4">
              <Users2 className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Community-Driven</h3>
              <p className="text-muted-foreground">
                Our platform thrives on the collective wisdom of AI practitioners, developers, and enthusiasts who contribute their insights and experiences.
              </p>
            </div>
            
            <div className="space-y-4">
              <Scale className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Unbiased Evaluation</h3>
              <p className="text-muted-foreground">
                We maintain strict neutrality in our platform, ensuring that all AI tools receive fair and objective evaluation based solely on user experiences.
              </p>
            </div>
            
            <div className="space-y-4">
              <Heart className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">User-First Approach</h3>
              <p className="text-muted-foreground">
                Every feature and decision is made with our users in mind, ensuring the platform serves their needs in discovering and evaluating AI tools.
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-semibold">Curate & Categorize</h4>
                <p className="text-muted-foreground">
                  We maintain a comprehensive database of AI tools, carefully categorized and tagged for easy discovery.
                </p>
              </div>
              <div className="space-y-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-semibold">Educate & Inform</h4>
                <p className="text-muted-foreground">
                  We provide detailed insights and educational content to help users understand and leverage AI technologies effectively.
                </p>
              </div>
              <div className="space-y-3">
                <Globe className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-semibold">Connect & Share</h4>
                <p className="text-muted-foreground">
                  We foster a global community where users can share experiences and learn from each other&apos;s AI journeys.
                </p>
              </div>
              <div className="space-y-3">
                <Zap className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-semibold">Analyze & Compare</h4>
                <p className="text-muted-foreground">
                  We offer comprehensive comparison tools to help users find the perfect AI solutions for their needs.
                </p>
              </div>
            </div>
          </section>

          {/* <section className="space-y-6">
            <h2 className="text-2xl font-bold">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-lg bg-card/30">
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <div className="text-muted-foreground">AI Tools Listed</div>
              </div>
              <div className="p-4 rounded-lg bg-card/30">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">User Reviews</div>
              </div>
              <div className="p-4 rounded-lg bg-card/30">
                <div className="text-3xl font-bold text-primary mb-2">100K+</div>
                <div className="text-muted-foreground">Monthly Users</div>
              </div>
            </div>
          </section> */}

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Rocket className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Our Vision for the Future</h2>
            </div>
            <p className="text-muted-foreground">
              As AI continues to transform our world, AI-Radar aims to be at the forefront of this revolution, helping individuals and organizations navigate the evolving landscape. We envision a future where:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Every organization can find the perfect AI tools for their needs</li>
              <li>AI adoption becomes more transparent and accessible</li>
              <li>User experiences shape the development of AI technologies</li>
              <li>Our platform serves as the definitive resource for AI tool discovery and evaluation</li>
            </ul>
          </section>

          <section className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Join Our Mission</h2>
            <p className="text-muted-foreground">
              Whether you&apos;re an AI enthusiast, professional, or just getting started, your experience matters. Join our growing community and help shape the future of AI tool discovery and evaluation.
            </p>
            <p className="text-muted-foreground">
              Have questions or want to collaborate? Reach out to us at <span className="text-primary">info@ai-radar.co</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}