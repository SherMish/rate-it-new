export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            מדיניות פרטיות
          </h1>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                1. הקדמה
              </h2>
              <p className="text-base text-muted-foreground">
                רייט איט (&quot;אנחנו&quot;, &quot;האתר&quot;, &quot;השירות&quot;) מחויבת לשמור על פרטיותכם.
                מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים, שומרים
                וחולקים את המידע שלכם בעת שימוש בפלטפורמה. שימוש באתר מהווה
                הסכמה למדיניות זו.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                2. המידע שאנו אוספים
              </h2>
              <h3 className="text-lg font-semibold mb-2">
                2.1 מידע שאתם מספקים
              </h3>
              <ul className="list-disc pr-6 text-muted-foreground">
                <li>פרטי חשבון (שם, אימייל, סיסמה)</li>
                <li>מידע בפרופיל אישי (תמונה, ביוגרפיה)</li>
                <li>ביקורות ודירוגים</li>
                <li>תגובות ופרסומים בפורומים</li>
                <li>פניות לתמיכה</li>
                <li>תשובות לסקרים</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4">
                2.2 מידע שנאסף אוטומטית
              </h3>
              <ul className="list-disc pr-6 text-muted-foreground">
                <li>פרטי מכשיר (IP, סוג דפדפן, מכשיר)</li>
                <li>נתוני שימוש (עמודים שנצפו, זמן שהייה)</li>
                <li>נתוני מיקום (מדינה, אזור)</li>
                <li>קבצי Cookie וטכנולוגיות דומות</li>
                <li>קבצי לוג ונתוני אנליטיקה</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                3. שימוש במידע שלכם
              </h2>
              <p className="text-muted-foreground">אנחנו משתמשים במידע כדי:</p>
              <ul className="list-disc pr-6 text-muted-foreground">
                <li>לספק ולשפר את השירות</li>
                <li>להציג ביקורות ודירוגים שפרסמתם</li>
                <li>להתאים אישית את החוויה באתר</li>
                <li>לשלוח עדכונים והתראות</li>
                <li>לנתח התנהגות משתמשים ולשפר את הפלטפורמה</li>
                <li>למנוע שימוש לרעה והונאה</li>
                <li>לציית לחובות משפטיות</li>
                <li>שיווק וקידום (באישורכם בלבד)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                4. שיתוף והעברת מידע
              </h2>
              <p className="text-muted-foreground">
                ייתכן שנחלוק את המידע שלכם עם:
              </p>
              <ul className="list-disc pr-6 text-muted-foreground">
                <li>ספקי שירותים שיסייעו לנו בתפעול האתר</li>
                <li>גורמי אכיפת חוק על פי דרישה חוקית</li>
                <li>משתמשים אחרים (פרופיל ציבורי וביקורות בלבד)</li>
                <li>שירותי אנליטיקה צד שלישי</li>
                <li>קונים פוטנציאליים במסגרת עסקאות עתידיות</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                לעולם לא נמכור את המידע האישי שלכם לצדדים שלישיים, וכל שיתוף
                יתבצע בהתאם למדיניות פרטיות זו.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                5. אבטחת מידע
              </h2>
              <p className="text-muted-foreground">
                אנו מפעילים אמצעי אבטחה מתקדמים, כולל:
              </p>
              <ul className="list-disc pr-6 text-muted-foreground">
                <li>הצפנת נתונים במעבר ובאחסון</li>
                <li>בקרות גישה ואימות משתמשים</li>
                <li>ביצוע הערכות אבטחה תקופתיות</li>
                <li>אחסון נתונים מאובטח</li>
                <li>הדרכות עובדים בנושא פרטיות ואבטחה</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                6. זכויותיכם בנוגע לפרטיות
              </h2>
              <p className="text-muted-foreground">יש לכם את הזכות:</p>
              <ul className="list-disc pr-6 text-muted-foreground">
                <li>לעיין ולבקש את המידע האישי שלכם</li>
                <li>לתקן מידע שגוי או חסר</li>
                <li>למחוק את המידע שלכם (&quot;הזכות להישכח&quot;)</li>
                <li>להגביל את השימוש בנתונים</li>
                <li>לבקש את המידע בפורמט דיגיטלי</li>
                <li>להתנגד לעיבוד המידע</li>
                <li>לבטל הסכמה שניתנה בעבר</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                7. Cookies וטכנולוגיות מעקב
              </h2>
              <p className="text-muted-foreground">
                אנו משתמשים ב-Cookies כדי:
              </p>
              <ul className="list-disc pr-6 text-muted-foreground">
                <li>לשפר את חווית המשתמש באתר</li>
                <li>לנתח נתוני שימוש</li>
                <li>להציג תוכן מותאם אישית</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                תוכלו לנהל הגדרות אלו דרך דפדפן האינטרנט שלכם.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                8. פרטיות ילדים
              </h2>
              <p className="text-muted-foreground">
                השירות אינו מיועד לילדים מתחת לגיל 13 ואיננו אוספים במודע מידע
                מילדים מתחת לגיל זה.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                9. שינויים במדיניות
              </h2>
              <p className="text-muted-foreground">
                ייתכן שנעדכן מדיניות זו מעת לעת ונודיע על שינויים משמעותיים באתר
                ובמייל.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                10. צרו קשר
              </h2>
              <p className="text-muted-foreground">
                לשאלות או פניות, צרו קשר במייל:{" "}
                <span className="text-primary">hello@rate-it.co.il</span>
              </p>
            </section>

            <p className="text-sm text-muted-foreground border-t pt-4">
              עודכן לאחרונה: 21 בדצמבר 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
