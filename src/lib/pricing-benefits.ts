export const benefitExplanations = {
  verified_badge: {
    title: " תג מאומת (Verified Badge)",
    description:
      "בלוטו מול המתחרים והראו ללקוחות שהעסק שלכם אמין, מקצועי ומאומת. זהו הסימן שמייצר אמון מיידי.",
  },
  real_time_analytics: {
    title: "נתוני חשיפה והתנהגות בזמן אמת",
    description:
      "עקבו אחרי צפיות, קליקים והמרות – והבינו איך הלקוחות מגיבים לפרופיל שלכם, כדי לשפר ביצועים.",
  },
  priority_support: {
    title: "עדיפות בתמיכה ושירות אישי",
    description:
      "מענה מהיר ומדויק מהצוות שלנו, כדי שתוכלו להתמקד בעסק בלי עיכובים.",
  },
  basic_dashboard: {
    title: "לוח בקרה בסיסי",
    description:
      "כלי פשוט ונוח לניהול פרופיל העסק שלכם ולמעקב אחרי פעילות ראשונית.",
  },
  review_management: {
    title: "ניהול ביקורות",
    description:
      "אפשרות לקבל ביקורות מלקוחות, להגיב להן, ולבנות אמון בצורה אותנטית.",
  },
};

export const planBenefitMappings = {
  free: ["basic_dashboard", "review_management"],
  plus: ["verified_badge", "real_time_analytics", "priority_support"],
};
