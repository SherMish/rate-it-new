"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HelpDialog() {
  const [open, setOpen] = useState(false);

  const commonIssues = [
    {
      question: "מה אם העסק שלי כבר מופיע באתר?",
      answer:
        "אין בעיה – פשוט צריך לאמת בעלות על הדומיין. לאחר מכן תקבלו שליטה מלאה על הפרופיל, תוכלו לעדכן פרטים, להגיב לביקורות ולעקוב אחר הביצועים.",
    },
    {
      question: "אין לי דומיין – אפשר בכל זאת להצטרף?",
      answer:
        "כרגע אנחנו תומכים רק בעסקים עם אתר פעיל. אם אין לכם דומיין – כתבו לנו במייל ואולי נוכל להציע פתרון חלופי.",
    },
    {
      question: "לחצתי על קישור האימות במייל והתהליך נתקע. מה עושים?",
      answer:
        "ודאו שפתחתם את הקישור באותו מכשיר ובאותו דפדפן שבו התחלתם את תהליך הרישום. עדיין לא עובד? דברו איתנו ונשמח לעזור.",
    },
    {
      question: "השלב הבא לא ברור לי או משהו לא עובד – מה עושים?",
      answer:
        "אנחנו כאן בשבילכם! מוזמנים לפנות אלינו דרך הצ׳אט, המייל או הטופס באתר ונחזור אליכם בהקדם.",
    },
  ];

  return (
    <>
      {/* Custom CSS for 15-second pulse animation */}
      <style jsx>{`
        @keyframes slowPulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
          }
        }
        .slow-pulse {
          animation: slowPulse 1s ease-in-out;
          animation-iteration-count: 1;
          animation-delay: 0s;
        }
        .slow-pulse-container {
          animation: slowPulse 1s ease-in-out infinite;
          animation-duration: 15s;
        }
      `}</style>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="fixed bottom-6 left-6 z-50">
            {/* Pulse ring effect - slower animation */}
            <div className="absolute inset-0 rounded-lg bg-primary/30 slow-pulse-container"></div>
            <div
              className="absolute inset-0 rounded-lg bg-primary/20"
              style={{
                animation: "slowPulse 1s ease-in-out infinite",
                animationDuration: "15s",
                animationDelay: "0.5s",
              }}
            ></div>

            <Button
              size="lg"
              className="relative bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/30 backdrop-blur-sm px-6 py-3 text-base font-semibold hover:scale-105"
            >
              <HelpCircle className="w-5 h-5 ml-3" />
              צריכים עזרה?
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              איך אנחנו יכולים לעזור?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Common Issues */}
            <div>
              <h3 className="text-lg font-semibold mb-4">שאלות נפוצות</h3>
              <div className="space-y-3">
                {commonIssues.map((issue, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-foreground mb-2">
                        {issue.question}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {issue.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Options */}
            <div>
              <h3 className="text-lg font-semibold mb-4">יצירת קשר ישירה</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {/* WhatsApp */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">WhatsApp</h4>
                        <p className="text-sm text-green-600">תגובה מהירה</p>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/972542226491?text=שלום%2C%20אני%20צריך%20עזרה%20עם%20רישום%20העסק%20ברייט-איט"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setOpen(false)}
                      >
                        שלח הודעת WhatsApp
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Email</h4>
                        <p className="text-sm text-blue-600">
                          תגובה תוך 24 שעות
                        </p>
                      </div>
                    </div>

                    {/* Display email address */}
                    <div className="mb-3 p-2 bg-blue-100/50 rounded-md">
                      <p
                        className="text-sm font-mono text-blue-700 text-center"
                        dir="ltr"
                      >
                        hello@rate-it.co.il
                      </p>
                    </div>

                    <a
                      href="mailto:hello@rate-it.co.il?subject=עזרה%20ברישום%20עסק&body=שלום%2C%0A%0Aאני%20צריך%20עזרה%20עם%20רישום%20העסק%20שלי%20ברייט-איט.%0A%0Aתודה%2C"
                      className="w-full"
                    >
                      {/* <Button
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                        onClick={() => setOpen(false)}
                      >
                        שלח אימייל
                      </Button> */}
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Note */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                אנחנו כאן לעזור לכם בכל שלב של התהליך. אל תהססו לפנות אלינו!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
