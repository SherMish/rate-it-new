import { Metadata } from "next";

// SEO metadata for Business pages
export const metadata: Metadata = {
  title: "עסקים - הצטרפו לרייט-איט | פלטפורמה לניהול ביקורות ומוניטין דיגיטלי",
  description:
    "הצטרפו לרייט-איט והפכו ביקורות לקוחות לנכס שיווקי. פלטפורמה מתקדמת לניהול מוניטין דיגיטלי, איסוף ביקורות וחיזוק אמון עם לקוחות בישראל.",
  keywords: [
    "פלטפורמה לעסקים",
    "ניהול ביקורות",
    "מוניטין דיגיטלי",
    "ביקורות לקוחות",
    "אמון עסקי",
    "פרופיל עסקי",
    "שיווק דיגיטלי",
    "לקוחות מרוצים",
    "עסק מאומת",
    "ביקורות אמיתיות",
    "חשיפה עסקית",
    "נוכחות דיגיטלית",
    "אמינות עסקית",
    "צמיחה עסקית",
    "לידים חדשים",
    "המרות לקוחות",
    "Rate It עסקים",
    "פלטפורמת ביקורות ישראלית",
  ],
  authors: [{ name: "Rate It" }],
  creator: "Rate It",
  publisher: "Rate It",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "הצטרפו לרייט-איט - פלטפורמה מתקדמת לניהול ביקורות ומוניטין עסקי",
    description:
      "בנו אמון עם לקוחות, הגדילו חשיפה והמירו מבקרים ללקוחות עם פלטפורמת הביקורות המתקדמת ברייט-איט. הירשמו חינם והתחילו לצמוח היום.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/business`,
    siteName: "Rate It",
    locale: "he_IL",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-business.png`,
        width: 1200,
        height: 630,
        alt: "Rate It עסקים - פלטפורמה לניהול ביקורות ומוניטין דיגיטלי",
        type: "image/png",
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-business-square.png`,
        width: 1200,
        height: 1200,
        alt: "Rate It עסקים - הצטרפו עכשיו",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "הצטרפו לרייט-איט | פלטפורמה לניהול ביקורות ומוניטין עסקי",
    description:
      "הפכו ביקורות לקוחות לנכס שיווקי עם רייט-איט. פלטפורמה מתקדמת לניהול מוניטין דיגיטלי - הירשמו חינם עכשיו!",
    images: {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/og-business.png`,
      alt: "Rate It עסקים - פלטפורמה לניהול ביקורות",
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
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/business`,
    languages: {
      "he-IL": `${process.env.NEXT_PUBLIC_APP_URL}/business`,
      "en-US": `${process.env.NEXT_PUBLIC_APP_URL}/en/business`,
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

// JSON-LD structured data for better SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "עסקים - הצטרפו לרייט-איט",
  description: "פלטפורמה מתקדמת לניהול ביקורות ומוניטין דיגיטלי לעסקים בישראל",
  url: `${process.env.NEXT_PUBLIC_APP_URL}/business`,
  isPartOf: {
    "@type": "WebSite",
    name: "Rate It",
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  mainEntity: {
    "@type": "Service",
    name: "רייט-איט פלטפורמת עסקים",
    description:
      "פלטפורמה לניהול ביקורות, בניית אמון ושיפור מוניטין דיגיטלי לעסקים",
    provider: {
      "@type": "Organization",
      name: "Rate It",
      url: process.env.NEXT_PUBLIC_APP_URL,
      logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      sameAs: [
        "https://www.facebook.com/RateItIL",
        "https://www.linkedin.com/company/rate-it-il",
        "https://twitter.com/RateItIL",
      ],
    },
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
    availableLanguage: ["he", "en"],
    serviceType: "Digital Reputation Management",
    category: "Business Software",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      description: "תוכנית בסיסית חינמית לניהול ביקורות עסקיות",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "תוכניות רייט-איט לעסקים",
      itemListElement: [
        {
          "@type": "Offer",
          name: "תוכנית Basic - חינמי",
          price: "0",
          priceCurrency: "ILS",
          description: "פרופיל עסקי בסיסי, קבלת ביקורות, מענה ללקוחות",
        },
        {
          "@type": "Offer",
          name: "תוכנית Plus - מתקדמת",
          price: "99",
          priceCurrency: "ILS",
          description: "תג עסק מאומת, חשיפה מוגברת, אנליטיקות מתקדמות",
        },
      ],
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
    ],
  },
  faq: {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "האם השירות באמת חינמי?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "כן! פתיחת פרופיל עסקי וקבלת ביקורות מלקוחות הן חינמיות לחלוטין. עסקים יכולים להזמין ביקורות, לנהל את הפרופיל ולהגיב – ללא עלות.",
        },
      },
      {
        "@type": "Question",
        name: "מי יכול להירשם לפלטפורמה?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "כל עסק עם אתר אינטרנט פעיל ודומיין משלו יכול להירשם. אנחנו מאמתים בעלות על הדומיין כדי להבטיח אמינות.",
        },
      },
      {
        "@type": "Question",
        name: "איך רייט-איט עוזרת לי להגיע ללקוחות חדשים?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "עסקים עם ביקורות חיוביות ותג 'מאומת' מקבלים יותר חשיפה בפלטפורמה, מופיעים גבוה יותר בתוצאות, ומשדרים אמון מיידי.",
        },
      },
    ],
  },
};

export default function BusinessLayout({
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
