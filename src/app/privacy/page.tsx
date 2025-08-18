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
              {/* <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                1. הקדמה וחובת הגילוי
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">הצהרת חובה על פי סעיף 11 לחוק הגנת הפרטיות</h3>
                <p className="text-sm">
                  <strong>חובת מתן המידע:</strong> מתן המידע המבוקש הינו התנדבותי. אין חובה חוקית למסור את המידע, 
                  אולם ללא מסירת המידע לא נוכל לספק לכם את השירותים המבוקשים.
                </p>
              </div>
              
              <p className="text-base text-muted-foreground">
                רייט איט בע"מ, ח.פ 123456789 (&ldquo;החברה&rdquo;, &ldquo;אנחנו&rdquo;, &ldquo;האתר&rdquo;, &ldquo;השירות&rdquo;) 
                מחויבת לשמור על פרטיותכם בהתאם לחוק הגנת הפרטיות התשמ&rdquo;א-1981 ותיקוניו, 
                כולל תיקון 13 הנכנס לתוקף ב-14 באוגוסט 2025. מדיניות פרטיות זו מסבירה 
                כיצד אנו אוספים, משתמשים, שומרים וחולקים את המידע שלכם בעת שימוש בפלטפורמה.
              </p> */}
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold mb-2">פרטי בעל השליטה במאגר:</h3>
                <ul className="text-sm space-y-1">
                  <li><strong>שם החברה:</strong> רייט איט בע&rdquo;מ</li>
                  <li><strong>כתובת:</strong> רחוב הרא״ה 73, רמת גן</li>
                  {/* <li><strong>טלפון:</strong> 03-1234567</li> */}
                  <li><strong>דוא&rdquo;ל:</strong> hello@rate-it.co.il</li>
                  {/* <li><strong>איש קשר לענייני פרטיות:</strong> מנהל הגנת מידע</li> */}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                1. המידע שאנו אוספים
              </h2>
              
              <h3 className="text-lg font-semibold mb-2">
                1.1 מידע אישי שאתם מספקים ביודעין
              </h3>
              <ul className="list-disc pr-6 text-muted-foreground space-y-1">
                <li>פרטי זהות: שם מלא, כתובת דוא&rdquo;ל, מספר טלפון</li>
                <li>פרטי חשבון: שם משתמש, סיסמה מוצפנת</li>
                <li>מידע בפרופיל: תמונת פרופיל, ביוגרפיה, העדפות אישיות</li>
                <li>תוכן שנוצר על ידי משתמשים: ביקורות, דירוגים, תגובות, פרסומים בפורומים</li>
                <li>פניות ותמיכה: הודעות, שאלות, תלונות ופניות שירות</li>
                <li>השתתפות בסקרים ומחקרים (באישור מפורש בלבד)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4">
                1.2 מידע אישי שנאסף אוטומטית
              </h3>
              <ul className="list-disc pr-6 text-muted-foreground space-y-1">
                <li>מזהים מקוונים: כתובת IP, מזהי מכשיר ייחודיים, מזהי דפדפן</li>
                <li>נתוני מכשיר: סוג מכשיר, מערכת הפעלה, גרסת דפדפן, רזולוציית מסך</li>
                <li>נתוני שימוש: עמודים שנצפו, זמן שהייה, דפוסי ניווט, מקורות הפניה</li>
                <li>נתוני מיקום כלליים: מדינה, עיר, אזור (לא מיקום מדויק)</li>
                <li>קבצי Cookie ומזהים דיגיטליים דומים</li>
                <li>קבצי לוג, נתוני אנליטיקה ומדדי ביצועים</li>
                <li>מידע על אינטראקציות עם תוכן ופרסומות</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4">
                1.3 מידע מצדדים שלישיים
              </h3>
              <ul className="list-disc pr-6 text-muted-foreground space-y-1">
                <li>מידע מרשתות חברתיות (בהסכמתכם המפורשת)</li>
                <li>נתונים מספקי שירותי תשלום (פרטי עסקה בלבד)</li>
                <li>מידע משירותי אימות זהות חיצוניים</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                2. מטרות השימוש במידע ובסיס חוקי
              </h2>
              
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">בסיס חוקי לעיבוד המידע:</h3>
                <p className="text-sm">
                  אנו מעבדים את המידע שלכם על בסיס הסכמתכם, לצורך ביצוע חוזה השירות, 
                  או לצורך האינטרסים הלגיטימיים שלנו בהפעלת הפלטפורמה.
                </p>
              </div>

              <p className="text-muted-foreground mb-4">אנחנו משתמשים במידע שלכם למטרות הבאות:</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">מתן השירות ותפעולו:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>יצירה וניהול חשבון משתמש</li>
                    <li>הצגת ביקורות, דירוגים ותוכן שפרסמתם</li>
                    <li>מתן גישה לפונקציונליות הפלטפורמה</li>
                    <li>עיבוד תשלומים ושירותים פרמיום</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">שיפור והתאמה אישית:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>התאמת תוכן והמלצות לפי העדפותיכם</li>
                    <li>ניתוח נתוני שימוש לשיפור השירות</li>
                    <li>פיתוח תכונות ושירותים חדשים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">תקשורת ועדכונים:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>שליחת הודעות מערכת והתראות</li>
                    <li>מענה לפניות ומתן תמיכה טכנית</li>
                    <li>עדכונים על שינויים בשירות (באישורכם)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">אבטחה וביטחון:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>זיהוי ומניעת שימוש לרעה, הונאה ופעילות חשודה</li>
                    <li>הגנה על אבטחת המערכת והמידע</li>
                    <li>אכיפת תנאי השירות ומדיניות הקהילה</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">חובות משפטיות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>עמידה בדרישות חוקיות ורגולטוריות</li>
                    <li>שיתוף פעולה עם רשויות החוק במקרים מוצדקים</li>
                    <li>הגנה על זכויות וביטחון המשתמשים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">שיווק וקידום (באישור מפורש בלבד):</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>שליחת חומר שיווקי ופרסומי</li>
                    <li>הצעות מותאמות אישית</li>
                    <li>מחקרי שוק וסקרי שביעות רצון</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                3. שיתוף והעברת מידע
              </h2>
              
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">עיקרון יסוד:</h3>
                <p className="text-sm">
                  אנו לא מוכרים, משכירים או מעבירים את המידע האישי שלכם לצדדים שלישיים 
                  למטרות מסחריות. כל שיתוף מידע מתבצע בהתאם למגבלות החוק ולמדיניות זו בלבד.
                </p>
              </div>

              <p className="text-muted-foreground mb-4">
                ייתכן שנשתף את המידע שלכם במקרים הבאים בלבד:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">ספקי שירותים מוסמכים:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>חברות אחסון ותשתית טכנולוגית</li>
                    <li>ספקי שירותי תשלום ועיבוד פיננסי</li>
                    <li>שירותי אנליטיקה ומדדי ביצועים</li>
                    <li>ספקי שירותי תמיכה ושירות לקוחות</li>
                    <li>שירותי אבטחת מידע ומניעת הונאות</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-2">
                    כל ספקי השירות חתומים על הסכמי סודיות ומחויבים להגן על המידע בהתאם לסטנדרטים גבוהים.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">רשויות חוק ורגולטוריות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>על פי צו בית משפט או דרישה חוקית</li>
                    <li>לצורך חקירת עבירות או הגנה על זכויות</li>
                    <li>במקרי חירום המסכנים בטיחות או חיים</li>
                    <li>לצורך עמידה בדרישות רגולטוריות</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">תוכן ציבורי:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>ביקורות ודירוגים שפרסמתם (לפי הגדרות הפרטיות שלכם)</li>
                    <li>פרופיל ציבורי (שם משתמש, תמונה, ביוגרפיה)</li>
                    <li>תגובות ופרסומים בפורומים ציבוריים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">העברות עסקיות:</h4>
                  <p className="text-muted-foreground text-sm">
                    במקרה של מיזוג, רכישה או מכירת נכסים, המידע עשוי לעבור לישות העוקבת, 
                    תוך הבטחת המשכיות ההגנה על הפרטיות.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                4. העברות מידע בינלאומיות
              </h2>
              
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">הודעה על העברות לחו&rdquo;ל:</h3>
                <p className="text-sm">
                  חלק מהמידע שלכם עשוי להיות מועבר ומאוחסן בשרתים מחוץ לישראל, 
                  כולל באיחוד האירופי, ארצות הברית ומדינות אחרות.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">הגנות חוקיות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>כל ההעברות מתבצעות בהתאם לתקנות ההעברה לחוק הגנת הפרטיות</li>
                    <li>הסכמים חוזיים עם כל הנמענים לשמירה על רמת הגנה שווה או גבוהה יותר</li>
                    <li>אימות עמידה בתקן ISO/IEC 27001 או שווה ערך</li>
                    <li>מנגנוני פיקוח ובקרה על שימוש במידע</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">זכויות מוגברות למידע מהאיחוד האירופי:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>הודעה מיוחדת בתוך חודש מקבלת המידע</li>
                    <li>זכות למחיקה מוגברת (&ldquo;הזכות להישכח&rdquo;)</li>
                    <li>עיקרון מינימיזציה - איסוף המידע המינימלי הנדרש</li>
                    <li>הודעה מוגברת על זכויות הפרט</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">מדינות היעד העיקריות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>איחוד האירופי (בהתאם להחלטת ההלימות)</li>
                    <li>ארצות הברית (עם הגנות חוזיות מיוחדות)</li>
                    <li>קנדה (רמת הגנה מוכרת)</li>
                    <li>מדינות נוספות עם הסכמי הגנה מתאימים</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                5. אבטחת מידע ותקני הגנה
              </h2>
              
              <p className="text-muted-foreground mb-4">
                אנו מיישמים אמצעי אבטחה מתקדמים הכוללים:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">הגנות טכניות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>הצפנת נתונים ברמה גבוהה במעבר ובאחסון (AES-256)</li>
                    <li>אימות דו-שלבי וניהול סיסמאות מתקדם</li>
                    <li>חומות אש ומערכות זיהוי חדירות</li>
                    <li>גיבויים מוצפנים וניהול מפתחות מאובטח</li>
                    <li>מעקב אחר גישה ולוגים של פעילות מערכת</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">הגנות ארגוניות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>בקרות גישה מבוססות תפקידים</li>
                    <li>הדרכות עובדים בנושאי אבטחה ופרטיות</li>
                    <li>מדיניות סודיות ואבטחת מידע</li>
                    <li>בדיקות אבטחה ופגיעות תקופתיות</li>
                    <li>תוכנית התמודדות עם אירועי אבטחה</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">תקנים ותעודות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>עמידה בתקנות האבטחה לחוק הגנת הפרטיות</li>
                    <li>יישום עקרונות אבטחת מידע לפי תקן ISO 27001</li>
                    <li>הערכות סיכונים תקופתיות</li>
                    <li>ביקורות אבטחה עצמאיות</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold mb-2">הודעה על אירועי אבטחה:</h3>
                <p className="text-sm">
                  במקרה של אירוע אבטחה חמור, נודיע מיידית לרשות להגנת הפרטיות ולמשתמשים 
                  הרלוונטיים, בהתאם לדרישות החוק ולהערכת הסיכונים.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                6. זכויותיכם בנוגע לפרטיות
              </h2>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">מימוש זכויות:</h3>
                <p className="text-sm">
                  לכל בקשה בנוגע לזכויותיכם, פנו אלינו במייל privacy@rate-it.co.il 
                  או דרך טופס יצירת הקשר באתר. נטפל בבקשתכם תוך 30 יום.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">זכות עיון ובקשת מידע:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>לקבל פרטים על כל המידע האישי שלכם שבידינו</li>
                    <li>לדעת למה אנו משתמשים במידע ועם מי אנו משתפים אותו</li>
                    <li>לקבל את המידע בעברית, ערבית או אנגלית לפי בחירתכם</li>
                    <li>להורות על נציג מוסמך לקבלת המידע</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">זכות תיקון ועדכון:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>לתקן מידע שגוי, לא מדויק או לא עדכני</li>
                    <li>להשלים מידע חסר או לא שלם</li>
                    <li>לבקש הבהרה של מידע לא ברור</li>
                    <li>לקבל אישור על ביצוע התיקונים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">זכות מחיקה והגבלה:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>למחוק מידע שגוי, לא רלוונטי או שנאסף שלא כדין</li>
                    <li>להסיר עצמכם ממאגרי דיוור ושיווק</li>
                    <li>לבקש הגבלת שימוש במידע למטרות ספציפיות</li>
                    <li>זכויות מחיקה מוגברות למידע מהאיחוד האירופי</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">זכות התנגדות ביטול הסכמה:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>להתנגד לעיבוד המידע למטרות שיווק</li>
                    <li>לבטל הסכמה שניתנה בעבר בכל עת</li>
                    <li>לסרב למתן מידע עתידי</li>
                    <li>לדרוש הפסקת עיבוד במקרים מסוימים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">זכות ניידות מידע:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>לקבל את המידע שלכם בפורמט מובנה וניתן לקריאה מכונה</li>
                    <li>להעביר את המידע לספק שירות אחר (כפוף למגבלות טכניות)</li>
                    <li>לבקש העברה ישירה במקרים מתאימים</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold mb-2">הגנה על זכויותיכם:</h3>
                <p className="text-sm">
                  אם אינכם מרוצים מהטיפול בבקשתכם, תוכלו לפנות לרשות להגנת הפרטיות 
                  או לבתי המשפט. זכויותיכם בנושא פרטיות מוגנות על פי חוק יסוד: כבוד האדם וחירותו.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                7. Cookies וטכנולוגיות מעקב
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">סוגי Cookies שאנו משתמשים בהם:</h4>
                  
                  <div className="ml-4 space-y-3">
                    <div>
                      <h5 className="font-medium">Cookies חיוניים (ללא אישור):</h5>
                      <ul className="list-disc pr-6 text-muted-foreground text-sm">
                        <li>ניהול הפעלת האתר והתחברות</li>
                        <li>אבטחה ומניעת הונאות</li>
                        <li>העדפות שפה ונגישות בסיסיות</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">Cookies אנליטיים (באישור):</h5>
                      <ul className="list-disc pr-6 text-muted-foreground text-sm">
                        <li>מדידת ביצועי האתר ונתוני שימוש</li>
                        <li>הבנת התנהגות משתמשים לשיפור השירות</li>
                        <li>זיהוי דפוסי גלישה ובעיות טכניות</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">Cookies שיווק ופרסום (באישור מפורש):</h5>
                      <ul className="list-disc pr-6 text-muted-foreground text-sm">
                        <li>התאמת פרסומות לתחומי העניין שלכם</li>
                        <li>מעקב אחר יעילות קמפיינים שיווקיים</li>
                        <li>הצגת תוכן מותאם אישית</li>
                        <li>שיתוף עם רשתות חברתיות (באישור נפרד)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold">ניהול העדפות Cookies:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>תוכלו לנהל את הגדרות הCookies דרך מרכז העדפות באתר</li>
                    <li>אפשרות לאשר או לדחות כל סוג Cookies בנפרד</li>
                    <li>שליטה דרך הגדרות הדפדפן שלכם</li>
                    <li>כיבוד אותות &ldquo;Do Not Track&rdquo; כאשר זמין</li>
                    <li>אפשרות ביטול הסכמה בכל עת</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">השפעת חסימת Cookies:</h4>
                  <p className="text-muted-foreground text-sm">
                    חסימת Cookies עשויה להגביל את הפונקציונליות של האתר, כולל בעיות 
                    בהתחברות, איבוד העדפות אישיות וחוויית משתמש פחות מותאמת.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                8. משך שמירת המידע
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">עקרונות שמירה:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>שמירה למשך הזמן הנדרש למטרות המקוריות בלבד</li>
                    <li>מחיקה אוטומטית כאשר המידע אינו נדרש עוד</li>
                    <li>שמירה זמנית נוספת לצרכים משפטיים או רגולטוריים</li>
                    <li>אנונימיזציה של נתונים סטטיסטיים לטווח ארוך</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">תקופות שמירה ספציפיות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li><strong>חשבונות פעילים:</strong> כל עוד החשבון פעיל ועד שנתיים לאחר סגירה</li>
                    <li><strong>ביקורות ודירוגים:</strong> כל עוד הם רלוונטיים ועד 7 שנים</li>
                    <li><strong>נתוני תמיכה:</strong> 3 שנים מתאריך הפנייה</li>
                    <li><strong>לוגי אבטחה:</strong> שנה אחת מתאריך האירוע</li>
                    <li><strong>נתוני שיווק:</strong> עד לביטול ההסכמה או 3 שנים</li>
                    <li><strong>רשומות פיננסיות:</strong> 7 שנים לפי דרישות חוק החשבונאות</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                9. פרטיות ילדים וקטינים
              </h2>
              
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">הגנה מיוחדת על קטינים:</h3>
                <p className="text-sm">
                  השירות אינו מיועד לילדים מתחת לגיל 13. איננו אוספים במודע מידע 
                  מילדים מתחת לגיל זה, ואם נתגלה מידע כזה - נמחק אותו מיידית.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">נהלים להגנה על קטינים:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>בדיקת גיל בעת יצירת חשבון</li>
                    <li>דרישת הסכמת הורים לגילאי 13-18</li>
                    <li>הגבלות תוכן המתאימות לגיל</li>
                    <li>מעקב מיוחד אחר פעילות משתמשים צעירים</li>
                    <li>דיווח מיידי על תוכן בלתי הולם המיועד לקטינים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">זכויות הורים ואפוטרופוסים:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>עיון במידע על ילדיהם</li>
                    <li>בקשת מחיקת חשבון ומידע</li>
                    <li>התנגדות לעיבוד מידע עתידי</li>
                    <li>קבלת הודעות על פעילות חשודה</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                10. שינויים במדיניות
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">הודעה על שינויים:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>שינויים מהותיים יובאו לידיעתכם לפחות 30 יום מראש</li>
                    <li>הודעה באתר, בדוא&rdquo;ל ובאמצעי תקשורת נוספים</li>
                    <li>אפשרות להתנגד לשינויים או לבטל את החשבון</li>
                    <li>שמירת גרסאות קודמות למעקב ושקיפות</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">סוגי שינויים:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li><strong>שינויים מהותיים:</strong> שינוי מטרות עיבוד, הרחבת שיתוף מידע</li>
                    <li><strong>שינויים טכניים:</strong> עדכון פרטי קשר, תיקון שגיאות</li>
                    <li><strong>שינויים רגולטוריים:</strong> התאמה לדרישות חוק חדשות</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                11. הגבלת אחריות וסעיפי הגנה
              </h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">הגבלות אחריות:</h3>
                <p className="text-sm">
                  אחריותנו בגין נזקי פרטיות מוגבלת למקסימום מבין: (א) הסכום ששילמתם 
                  עבור השירות ב-12 החודשים האחרונים, או (ב) 5,000 ₪, למעט במקרי רשלנות חמורה או כוונת זדון.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">כוח עליון ונסיבות בלתי צפויות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>אירועי סייבר וחדירות למרות אמצעי האבטחה הסבירים</li>
                    <li>כשלים בתשתיות תקשורת מחוץ לשליטתנו</li>
                    <li>הוראות רשויות או צווי בית משפט</li>
                    <li>מלחמות, אסונות טבע ומצבי חירום לאומיים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">כללי שיפוי הדדי:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>שיפוי בגין תביעות צד שלישי הנובעות משימוש בלתי חוקי בשירות</li>
                    <li>שיפוי בגין תוכן שפרסמתם שפוגע בזכויות אחרים</li>
                    <li>הגבלת שיפוי במקרי הפרת חוק פלילי</li>
                    <li>חובת הודעה ושיתוף פעולה בהליכים משפטיים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">הצהרת דיוק מידע:</h4>
                  <p className="text-muted-foreground text-sm">
                    השירות מסופק &ldquo;כפי שהוא&rdquo; עם מגבלות על דיוק המידע הנובע מעיבוד אוטומטי. 
                    אחריותכם לוודא את דיוק המידע האישי שלכם ולהודיע על אי-דיוקים.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                12. יישוב מחלוקות ובוררות
              </h2>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">הסכם בוררות:</h3>
                <p className="text-sm">
                  מחלוקות בנושאי פרטיות יופנו לבוררות מחייבת לפי חוק הבוררות הבינלאומי 
                  המסחרי הישראלי 2024, למעט תביעות ייצוגיות או זכויות חוקתיות שאינן ניתנות לוויתור.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">תנאי הבוררות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>בוררות יחיד לסכסוכים עד 100,000 ₪</li>
                    <li>שלושה בוררים לסכסוכים גבוהים יותר</li>
                    <li>מקום הבוררות: תל אביב</li>
                    <li>שפת ההליכים: עברית או אנגלית לפי בחירת הצדדים</li>
                    <li>החוק הישראלי יחול על ההליכים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">יוצאים מהבוררות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>תביעות ייצוגיות (class actions)</li>
                    <li>זכויות חוקתיות להגנת הפרטיות</li>
                    <li>הליכים בפני רשות הגנת הפרטיות</li>
                    <li>צווי מניעה דחופים</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">אכיפת החלטות בוררות:</h4>
                  <p className="text-muted-foreground text-sm">
                    החלטות הבוררות ניתנות לאכיפה בבתי המשפט הישראליים ובינלאומית 
                    בהתאם לאמנת ניו יורק שישראל חתומה עליה ללא הסתייגויות.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                13. צרו קשר ומימוש זכויות
              </h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">דרכי יצירת קשר:</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>מנהל הגנת מידע:</strong> privacy@rate-it.co.il</div>
                    <div><strong>מחלקת שירות לקוחות:</strong> support@rate-it.co.il</div>
                    <div><strong>טלפון:</strong> 03-1234567 (ימים א&rsquo;-ה&rsquo; 9:00-17:00)</div>
                    <div><strong>דואר רגיל:</strong> רייט איט בע&rdquo;מ, רחוב הרצל 123, תל אביב 6473424</div>
                    <div><strong>טופס יצירת קשר:</strong> זמין באתר בכל עת</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold">מועדי מענה:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li>בקשות עיון במידע: תוך 30 יום</li>
                    <li>בקשות תיקון ומחיקה: תוך 30 יום</li>
                    <li>פניות שירות כללי: תוך 72 שעות</li>
                    <li>דיווח על אירועי אבטחה: מענה מיידי</li>
                    <li>תלונות ובקשות מיוחדות: תוך 14 יום</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">רשויות פיקוח נוספות:</h4>
                  <ul className="list-disc pr-6 text-muted-foreground text-sm">
                    <li><strong>רשות להגנת הפרטיות:</strong> https://www.gov.il/he/departments/the_privacy_protection_authority</li>
                    <li><strong>טלפון הרשות:</strong> 02-6666666</li>
                    <li><strong>כתובת הרשות:</strong> רחוב קפלן 2, ירושלים</li>
                    <li>אפשרות להגשת תלונה מקוונת באתר הרשות</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">מידע על המדיניות:</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div><strong>גרסה:</strong> 2.0 (תיקון 13)</div>
                  <div><strong>תאריך עדכון:</strong> 14 באוגוסט 2025</div>
                  <div><strong>תחילה:</strong> עם כניסת תיקון 13 לתוקף</div>
                  <div><strong>עדכון קודם:</strong> 21 בדצמבר 2024</div>
                  <div><strong>סטטוס רישום מאגר:</strong> פטור מרישום (מתחת ל-10,000 נתוני נושאים)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}