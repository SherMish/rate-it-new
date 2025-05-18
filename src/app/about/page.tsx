import {
  Building2,
  Users2,
  Target,
  Award,
  Shield,
  Globe,
  Sparkles,
  Scale,
  Heart,
  Zap,
  BookOpen,
  Rocket,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative" dir="rtl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8 rounded-lg border bg-card/50 backdrop-blur-xl p-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              אודות Rate It
            </h1>
            <p className="text-xl text-muted-foreground">
              פלטפורמת הביקורות שמחברת בין לקוחות לעסקים בישראל
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              הקמנו את Rate It מתוך מטרה לעזור לישראלים לקבל החלטות מושכלות לגבי
              עסקים ושירותים אונליין. בעידן שבו קשה להבדיל בין ביקורת אמיתית
              לפרסום סמוי, אנחנו נותנים במה לשקיפות, אמינות ולדעות אותנטיות של
              משתמשים אמיתיים.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Shield className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">שקיפות ואמינות</h3>
              <p className="text-muted-foreground">
                כל ביקורת ודירוג בפלטפורמה שלנו נכתבים על ידי משתמשים אמיתיים
                שעברו אימות, ללא התערבות של עסקים או גורמים מסחריים.
              </p>
            </div>

            <div className="space-y-4">
              <Users2 className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">קהילה במרכז</h3>
              <p className="text-muted-foreground">
                אנחנו מעודדים קהילה פעילה של לקוחות שמשתפים חוויות ועוזרים זה
                לזה למצוא את העסקים הטובים ביותר.
              </p>
            </div>

            <div className="space-y-4">
              <Scale className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">דירוג אובייקטיבי</h3>
              <p className="text-muted-foreground">
                אין לנו העדפות – אנחנו דואגים לסביבה ניטרלית שבה כל עסק נמדד לפי
                חוויות הלקוחות בלבד.
              </p>
            </div>

            <div className="space-y-4">
              <Heart className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">חוויית משתמש לפני הכל</h3>
              <p className="text-muted-foreground">
                כל החלטה שאנו מקבלים מתמקדת בשיפור החוויה שלכם, כדי שתמצאו בקלות
                את העסקים והשירותים שמתאימים לכם.
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">מה אנחנו עושים?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-semibold">איסוף וחלוקת מידע</h4>
                <p className="text-muted-foreground">
                  אנחנו אוספים מידע אמין על אלפי עסקים ומארגנים אותו בצורה נוחה
                  וידידותית.
                </p>
              </div>
              <div className="space-y-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-semibold">חינוך והסברה</h4>
                <p className="text-muted-foreground">
                  אנו מספקים תכנים והדרכות שעוזרים לצרכנים ולעסקים להבין ולשפר
                  את האינטראקציה ביניהם.
                </p>
              </div>
              <div className="space-y-3">
                <Globe className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-semibold">קהילה ותקשורת</h4>
                <p className="text-muted-foreground">
                  אנחנו בונים קהילה שבה צרכנים ועסקים יכולים לשוחח, לשאול שאלות
                  ולקבל מענה אמיתי.
                </p>
              </div>
              <div className="space-y-3">
                <Zap className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-semibold">השוואה ובחירה נכונה</h4>
                <p className="text-muted-foreground">
                  בעזרת כלי השוואה מתקדמים, אנחנו עוזרים לכם לבחור את העסקים
                  הטובים ביותר לפי הצרכים שלכם.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Rocket className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">החזון שלנו לעתיד</h2>
            </div>
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

          <section className="text-center space-y-4">
            <h2 className="text-2xl font-bold">הצטרפו אלינו</h2>
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
