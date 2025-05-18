import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoginModal } from "@/components/auth/login-modal";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";
import { Providers } from "@/components/providers/providers";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { useErrorTracking } from "@/hooks/useErrorTracking";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ErrorTrackingWrapper } from "./components/ErrorTrackingWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Rate It",
    template: "%s | Rate It",
  },
  description: "מצא וסקור כלי בינה מלאכותית",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        sizes: "any",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        {isProduction && GA_TRACKING_ID && (
          <>
            <Script id="check-consent">
              {`
                function hasAnalyticsConsent() {
                  try {
                    const consent = localStorage.getItem("cookie-consent");
                    if (!consent) return false;
                    const settings = JSON.parse(consent);
                    return settings.analytics === true;
                  } catch {
                    return false;
                  }
                }
                if (true) { //hasAnalyticsConsent()
                  // Load GA script only if we have consent
                  const script = document.createElement('script');
                  script.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}';
                  script.async = true;
                  document.head.appendChild(script);
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}');
                }
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>
        {/* <ErrorTrackingWrapper /> */}
        <Providers>
          <AnalyticsProvider />
          {/* <ErrorBoundary> */}
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <LoginModal />
          <Toaster />
          <CookieBanner />
          {/* </ErrorBoundary> */}
        </Providers>
      </body>
    </html>
  );
}
