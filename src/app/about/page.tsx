import { Building2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
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
