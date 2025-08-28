import "./globals.css";
import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoginModal } from "@/components/auth/login-modal";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";
import { Providers } from "@/components/providers/providers";
import Script from "next/script";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { WebVitalsProvider } from "@/components/providers/web-vitals-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { useErrorTracking } from "@/hooks/useErrorTracking";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ErrorTrackingWrapper } from "./components/ErrorTrackingWrapper";
import { LoadingProvider } from "@/contexts/loading-context";
import { TopProgressBar } from "@/components/ui/top-progress-bar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";

const heebo = Heebo({ subsets: ["latin", "hebrew"] });

export const metadata: Metadata = {
  title: {
    default: "Rate It",
    template: "%s | Rate It",
  },
  description: "הפלטפורמה הישראלית לביקורות עסקים דיגיטליים. בדקו מה לקוחות אמיתיים חושבים לפני הקנייה ושתפו את החוויות שלכם עם אחרים.",
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
        {isProduction && (
          <>
            {/* Google Tag Manager */}
            <Script id="gtm-head" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W3XZJ75L');`}
            </Script>
            {/* End Google Tag Manager */}

            {/* Google Analytics (gtag.js) */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-B6S1WY0XN9"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-B6S1WY0XN9');
              `}
            </Script>
            {/* End Google Analytics */}
          </>
        )}
      </head>
      <body className={heebo.className}>
        {isProduction && (
          <>
            {/* Google Tag Manager (noscript) */}
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-W3XZJ75L"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
            {/* End Google Tag Manager (noscript) */}
          </>
        )}
        {/* <ErrorTrackingWrapper /> */}
        <Providers>
          <LoadingProvider>
            <AnalyticsProvider />
            <WebVitalsProvider />
            <TopProgressBar />
            {/* <ErrorBoundary> */}
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <ConditionalFooter />
            </div>
            <LoginModal />
            <Toaster />
            <CookieBanner />
            {/* </ErrorBoundary> */}
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
