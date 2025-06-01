import { Metadata } from "next";

// SEO metadata for Business Registration page
export const metadata: Metadata = {
  title: "הרשמת עסקים - רייט-איט | פלטפורמה לניהול ביקורות ומוניטין דיגיטלי",
  description:
    "הירשמו לרייט-איט והתחילו לבנות אמון עם לקוחות. תהליך הרשמה פשוט ומהיר לעסקים שרוצים לנהל ביקורות ומוניטין דיגיטלי בישראל.",
  keywords: [
    "הרשמת עסק",
    "רייט-איט",
    "ניהול ביקורות",
    "מוניטין דיגיטלי",
    "פרופיל עסקי",
    "עסק מאומת",
    "בניית אמון",
    "ביקורות לקוחות",
    "פלטפורמה לעסקים",
    "עסקים בישראל",
    "דירוג עסקים",
    "אמינות עסקית",
    "שיווק דיגיטלי",
    "לקוחות מרוצים",
    "המרות לקוחות",
    "צמיחה עסקית",
    "נוכחות דיגיטלית",
  ],
  authors: [{ name: "Rate It" }],
  creator: "Rate It",
  publisher: "Rate It",
  openGraph: {
    type: "website",
    title: "הרשמת עסקים - רייט-איט | בנו אמון עם לקוחות",
    description:
      "הצטרפו לרייט-איט והפכו ביקורות לקוחות לנכס שיווקי. תהליך הרשמה פשוט לעסקים שרוצים לגדול ולבנות אמון עם לקוחות.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/business/register`,
    siteName: "Rate It",
    locale: "he_IL",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-business-register.png`,
        width: 1200,
        height: 630,
        alt: "הרשמת עסקים לרייט-איט - בנו אמון עם לקוחות",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "הרשמת עסקים - רייט-איט | בנו אמון עם לקוחות",
    description:
      "הצטרפו לרייט-איט והפכו ביקורות לקוחות לנכס שיווקי. תהליך הרשמה פשוט לעסקים - הירשמו חינם!",
    images: {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/og-business-register.png`,
      alt: "הרשמת עסקים לרייט-איט",
    },
    creator: "@RateItIL",
    site: "@RateItIL",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/business/register`,
    languages: {
      "he-IL": `${process.env.NEXT_PUBLIC_APP_URL}/business/register`,
      "en-US": `${process.env.NEXT_PUBLIC_APP_URL}/en/business/register`,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  other: {
    "msapplication-TileColor": "#3b82f6",
    "theme-color": "#3b82f6",
  },
};

// JSON-LD structured data for registration page
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "הרשמת עסקים - רייט-איט",
  description:
    "הירשמו לרייט-איט והתחילו לבנות אמון עם לקוחות. תהליך הרשמה פשוט ומהיר לעסקים שרוצים לנהל ביקורות ומוניטין דיגיטלי.",
  url: `${process.env.NEXT_PUBLIC_APP_URL}/business/register`,
  isPartOf: {
    "@type": "WebSite",
    name: "Rate It",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  mainEntity: {
    "@type": "Service",
    name: "הרשמת עסקים לרייט-איט",
    description:
      "תהליך הרשמה מהיר ופשוט לעסקים שרוצים לנהל ביקורות, לבנות אמון ולשפר מוניטין דיגיטלי",
    provider: {
      "@type": "Organization",
      name: "Rate It",
      url: process.env.NEXT_PUBLIC_APP_URL,
      logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    },
    serviceType: "Business Registration",
    category: "Digital Reputation Management",
    offers: [
      {
        "@type": "Offer",
        name: "רישום עסק חינמי",
        price: "0",
        priceCurrency: "ILS",
        description: "רישום בסיסי לניהול ביקורות עסקיות ובניית אמון עם לקוחות",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "חבילת Plus לעסקים",
        price: "99",
        priceCurrency: "ILS",
        description: "תג עסק מאומת, חשיפה מוגברת ותכונות מתקדמות",
        availability: "https://schema.org/InStock",
      },
    ],
  },
  potentialAction: {
    "@type": "RegisterAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/business/register`,
    },
    result: {
      "@type": "Thing",
      name: "פרופיל עסקי ברייט-איט",
    },
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "דף הבית",
        item: process.env.NEXT_PUBLIC_APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "עסקים",
        item: `${process.env.NEXT_PUBLIC_APP_URL}/business`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "הרשמה",
        item: `${process.env.NEXT_PUBLIC_APP_URL}/business/register`,
      },
    ],
  },
};

export default function BusinessRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
