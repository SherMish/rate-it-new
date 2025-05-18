export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto rounded-lg border bg-card/50 backdrop-blur-xl p-8">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                AI-Radar (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. By using our platform, you consent to the practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-2">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Account information (name, email, password)</li>
                <li>Profile information (bio, profile picture)</li>
                <li>Reviews and ratings</li>
                <li>Comments and forum posts</li>
                <li>Communications with us</li>
                <li>Survey responses</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Device information (IP address, browser type, device type)</li>
                <li>Usage data (pages visited, time spent, clicks)</li>
                <li>Location data (country, region)</li>
                <li>Cookies and similar technologies</li>
                <li>Log files and analytics data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground">We use collected information for:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Providing and maintaining our services</li>
                <li>Processing and displaying your reviews and ratings</li>
                <li>Personalizing your experience</li>
                <li>Communicating with you about updates and features</li>
                <li>Analyzing usage patterns to improve our platform</li>
                <li>Detecting and preventing fraud or abuse</li>
                <li>Complying with legal obligations</li>
                <li>Marketing and promotional purposes (with consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground">We may share your information with:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Service providers and business partners who assist in our operations</li>
                <li>Law enforcement when required by law</li>
                <li>Other users (only your public profile and reviews)</li>
                <li>Third-party analytics providers</li>
                <li>Potential buyers in case of a business transaction</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We do not sell your personal information to third parties. Any sharing of information is conducted in accordance with this Privacy Policy and applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage practices</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
              <h3 className="text-xl font-semibold mb-2">6.1 GDPR Rights (EU Users)</h3>
              <p className="text-muted-foreground">
                Under the GDPR, you have the following rights:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.2 CCPA Rights (California Residents)</h3>
              <p className="text-muted-foreground">
                Under the CCPA, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Know what personal information is collected</li>
                <li>Know if personal information is sold or disclosed</li>
                <li>Say no to the sale of personal information</li>
                <li>Access your personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Equal service and price (non-discrimination)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Remember your preferences</li>
                <li>Understand how you use our platform</li>
                <li>Improve our services</li>
                <li>Provide personalized content</li>
                <li>Analyze traffic patterns</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You can control cookie preferences through your browser settings. However, disabling certain cookies may limit your ability to use some features of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
              <p className="text-muted-foreground">
                We may transfer your information to countries other than your country of residence. When we do so, we ensure appropriate safeguards are in place, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Standard contractual clauses</li>
                <li>Data processing agreements</li>
                <li>Adequacy decisions by relevant authorities</li>
                <li>Other legal mechanisms to ensure data protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground">
                Our platform is not intended for children under 13 years of age. We do not knowingly collect or maintain information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Provide our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                When information is no longer needed, it will be securely deleted or anonymized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the &quot;Last Updated&quot; date</li>
                <li>Sending an email notification for significant changes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: hello@rate-it.co.il<br />
              </p>
            </section>

            <p className="text-sm text-muted-foreground">
              Last Updated: December 21, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}