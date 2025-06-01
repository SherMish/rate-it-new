import { Building2 } from "lucide-react";
import { Metadata } from "next";

// SEO metadata for About page
export const metadata: Metadata = {
  title: "אודות Rate It | פלטפורמת הביקורות המהימנה לעסקים בישראל",
  description:
    "למד על Rate It - פלטפורמת הביקורות שמחברת בין לקוחות לעסקים בישראל. בנינו סביבה בטוחה ואמינה לחלוקת חוויות אמיתיות ובניית אמון דיגיטלי.",
  keywords: [
    "אודות Rate It",
    "פלטפורמת ביקורות",
    "אמינות עסקית",
    "ביקורות אמיתיות",
    "שקיפות עסקית",
    "קהילת לקוחות",
    "אמון דיגיטלי",
    "חוויות לקוחות",
    "עסקים בישראל",
    "דירוג אובייקטיבי",
    "משוב לקוחות",
    "מוניטין דיגיטלי",
    "פלטפורמה ישראלית",
    "ביקורות מאומתות",
    "שירות לקוחות",
    "איכות שירות",
    "בחירת עסקים",
    "המלצות לקוחות",
  ],
  authors: [{ name: "Rate It Team" }],
  creator: "Rate It",
  publisher: "Rate It",
  openGraph: {
    type: "website",
    title: "אודות Rate It | הפלטפורמה המובילה לביקורות עסקיות בישראל",
    description:
      "גלה את הסיפור מאחורי Rate It - איך אנחנו בונים גשר של אמון בין עסקים ללקוחות עם ביקורות אמיתיות ושקופות.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
    siteName: "Rate It",
    locale: "he_IL",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-about.png`,
        width: 1200,
        height: 630,
        alt: "Rate It - אודות הפלטפורמה לביקורות עסקיות",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "אודות Rate It | פלטפורמת הביקורות המובילה בישראל",
    description:
      "גלה איך Rate It מחברת בין עסקים ללקוחות עם ביקורות אמיתיות ואמינות דיגיטלית.",
    images: {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/og-about.png`,
      alt: "Rate It - אודות הפלטפורמה",
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
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
    languages: {
      "he-IL": `${process.env.NEXT_PUBLIC_APP_URL}/about`,
      "en-US": `${process.env.NEXT_PUBLIC_APP_URL}/en/about`,
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

// JSON-LD structured data for About page
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "אודות Rate It",
  description:
    "פלטפורמת הביקורות המובילה בישראל המחברת בין לקוחות לעסקים באמינות ושקיפות",
  url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
  isPartOf: {
    "@type": "WebSite",
    name: "Rate It",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  about: {
    "@type": "Organization",
    name: "Rate It",
    description: "פלטפורמה לביקורות אמינות ודירוגים של עסקים בישראל",
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    foundingDate: "2024",
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
    serviceArea: {
      "@type": "Country",
      name: "Israel",
    },
    knowsAbout: [
      "ביקורות עסקיות",
      "מוניטין דיגיטלי",
      "אמינות עסקית",
      "שירות לקוחות",
      "פלטפורמות דיגיטליות",
    ],
    mission:
      "לחבר בין לקוחות לעסקים באמינות ושקיפות, ליצור סביבה בטוחה לחלוקת חוויות אמיתיות",
    sameAs: [
      "https://www.facebook.com/RateItIL",
      "https://www.linkedin.com/company/rate-it-il",
      "https://twitter.com/RateItIL",
    ],
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
        name: "אודות",
        item: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              אודות Rate It
            </h1>
            <p className="text-lg text-muted-foreground">
              פלטפורמת הביקורות שמחברת בין לקוחות לעסקים בישראל
            </p>
          </div>

          <div className="prose max-w-none">
            <p className="text-base text-muted-foreground leading-relaxed">
              הקמנו את Rate It מתוך מטרה לעזור לישראלים לקבל החלטות מושכלות לגבי
              עסקים ושירותים אונליין. בעידן שבו קשה להבדיל בין ביקורת אמיתית
              לפרסום סמוי, אנחנו נותנים במה לשקיפות, אמינות ולדעות אותנטיות של
              משתמשים אמיתיים.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y py-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">שקיפות ואמינות</h3>
              <p className="text-muted-foreground">
                כל ביקורת ודירוג בפלטפורמה שלנו נכתבים על ידי משתמשים אמיתיים
                שעברו אימות, ללא התערבות של עסקים או גורמים מסחריים.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">קהילה במרכז</h3>
              <p className="text-muted-foreground">
                אנחנו מעודדים קהילה פעילה של לקוחות שמשתפים חוויות ועוזרים זה
                לזה למצוא את העסקים הטובים ביותר.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">דירוג אובייקטיבי</h3>
              <p className="text-muted-foreground">
                אין לנו העדפות – אנחנו דואגים לסביבה ניטרלית שבה כל עסק נמדד לפי
                חוויות הלקוחות בלבד.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">חוויית משתמש לפני הכל</h3>
              <p className="text-muted-foreground">
                כל החלטה שאנו מקבלים מתמקדת בשיפור החוויה שלכם, כדי שתמצאו בקלות
                את העסקים והשירותים שמתאימים לכם.
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b pb-2">
              מה אנחנו עושים?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-base font-medium">איסוף וחלוקת מידע</h4>
                <p className="text-muted-foreground">
                  אנחנו אוספים מידע אמין על אלפי עסקים ומארגנים אותו בצורה נוחה
                  וידידותית.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium">חינוך והסברה</h4>
                <p className="text-muted-foreground">
                  אנו מספקים תכנים והדרכות שעוזרים לצרכנים ולעסקים להבין ולשפר
                  את האינטראקציה ביניהם.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium">קהילה ותקשורת</h4>
                <p className="text-muted-foreground">
                  אנחנו בונים קהילה שבה צרכנים ועסקים יכולים לשוחח, לשאול שאלות
                  ולקבל מענה אמיתי.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium">השוואה ובחירה נכונה</h4>
                <p className="text-muted-foreground">
                  בעזרת כלי השוואה מתקדמים, אנחנו עוזרים לכם לבחור את העסקים
                  הטובים ביותר לפי הצרכים שלכם.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">
              החזון שלנו לעתיד
            </h2>
            <p className="text-muted-foreground">
              Rate It שואפת להוביל שינוי אמיתי בשוק העסקים בישראל, שבו:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>הלקוחות יכולים לסמוך על כל ביקורת שהם קוראים</li>
              <li>עסקים מקבלים הזדמנות הוגנת להציג את השירותים שלהם</li>
              <li>השקיפות הופכת לנורמה בכל אינטראקציה דיגיטלית</li>
              <li>
                הצרכנים יכולים לבחור בקלות ובביטחון את העסקים שמתאימים להם
              </li>
            </ul>
          </section>

          <section className="text-center space-y-4 pt-4 border-t">
            <h2 className="text-xl font-semibold">הצטרפו אלינו</h2>
            <p className="text-muted-foreground">
              בין אם אתם צרכנים שרוצים למצוא את העסקים הטובים ביותר או בעלי
              עסקים שמחפשים לגדול, Rate It היא המקום שלכם.
            </p>
            <p className="text-muted-foreground">
              יש לכם שאלות או רעיונות לשיתוף פעולה? צרו איתנו קשר בכתובת:{" "}
              <span className="text-primary">hello@rate-it.co.il</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
