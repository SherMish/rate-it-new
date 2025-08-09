"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { Copy, Info } from "lucide-react";
import { toast } from "sonner";
import DashboardContainer from "@/app/business/components/DashboardContainer";

const WIDGET_TYPES = [
  {
    id: "card",
    name: "Card - כרטיס אמון",
    description:
      "כרטיס עשיר המציג דירוג, מספר ביקורות וקישור לדף Rate-It שלכם.",
  },
  {
    id: "simple",
    name: "Simple - כוכבים",
    description:
      "וידג׳ט מינימליסטי עם לוגו וכוכבים, כולל דירוג ומספר ביקורות (ללא TrustScore).",
  },
] as const;

type RatingData = { averageRating: number; reviewCount: number };

// Rate-It logo from Cloudinary
const LOGO_URL =
  "https://res.cloudinary.com/dwqdhp70e/image/upload/v1754689799/defypsjlegiwhfwqwwzf.png";

function getEmbedSnippet(baseUrl: string, websiteId: string, type: string) {
  const scriptSrc = `${baseUrl}/widget/embed.js`;
  const dataSrc = `${baseUrl}/api/public/widget?websiteId=${websiteId}`;
  return `<!-- Rate-It Widget (${type}) -->\n<script async src="${scriptSrc}" data-rateit-website-id="${websiteId}" data-rateit-type="${type}" data-rateit-src="${dataSrc}"></script>`;
}

function RateItLogo({ size = 24 }: { size?: number }) {
  return (
    <img
      src={LOGO_URL}
      alt="Rate-It"
      style={{
        height: size,
        width: "auto",
        display: "block",
        objectFit: "contain",
        filter: "brightness(1.1) contrast(1.05)",
        backgroundColor: "transparent",
      }}
    />
  );
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const filled = Math.round(value);
  return (
    <div style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            color: i <= filled ? "#f59e0b" : "#e5e7eb",
            fontSize: size,
            lineHeight: 1,
            textShadow:
              i <= filled ? "0 1px 2px rgba(245, 158, 11, 0.3)" : "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function PreviewCard({ data }: { data: RatingData }) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: 20,
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        boxShadow:
          "0 4px 16px rgba(124, 58, 237, 0.08), 0 2px 8px rgba(0, 0, 0, 0.1)",
        minWidth: 280,
        maxWidth: 320,
        color: "#1e293b",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative" as const,
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 8px 24px rgba(124, 58, 237, 0.12), 0 4px 12px rgba(0, 0, 0, 0.15)";
        e.currentTarget.style.background =
          "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 4px 16px rgba(124, 58, 237, 0.08), 0 2px 8px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.background =
          "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
      }}
    >
      {/* Purple accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #7c3aed, #ec4899)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          direction: "ltr",
        }}
      >
        <RateItLogo size={24} />
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontWeight: 500,
          }}
        >
          דירוג לקוחות
        </div>
      </div>

      {/* Rating section */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#7c3aed",
              lineHeight: 1,
            }}
          >
            {data.averageRating.toFixed(1)}
          </div>
          <div style={{ flex: 1 }}>
            <Stars value={data.averageRating} size={20} />
          </div>
        </div>

        <div
          style={{
            fontSize: 14,
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          מבוסס על {data.reviewCount} ביקורות לקוחות
        </div>
      </div>

      {/* Trust indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          background:
            "linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)",
          borderRadius: 8,
          border: "1px solid rgba(124, 58, 237, 0.1)",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "0 0 0 2px rgba(34, 197, 94, 0.2)",
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: "#16a34a",
            fontWeight: 600,
          }}
        >
          מאומת על ידי Rate-It
        </span>
      </div>
    </div>
  );
}

function PreviewSimple({ data }: { data: RatingData }) {
  const filled = Math.round(data.averageRating);
  return (
    <div
      style={{
        display: "inline-block",
        padding: 16,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        minWidth: 320,
        color: "#1e293b",
      }}
    >
      {/* Header - centered logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <RateItLogo size={60} />
      </div>
      {/* Stars row - improved styling */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 12,
          justifyContent: "center",
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: i < filled ? "#7c3aed" : "#e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                color: i < filled ? "white" : "#94a3b8",
                fontSize: 24,
                lineHeight: 1,
                fontWeight: "bold",
              }}
            >
              ★
            </span>
          </div>
        ))}
      </div>
      {/* Rating and count - centered */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        <span>{data.averageRating.toFixed(1)}</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span>{data.reviewCount} ביקורות</span>
      </div>
    </div>
  );
}

export default function WidgetsPage() {
  const { website } = useBusinessGuard();
  const [copied, setCopied] = useState<string | null>(null);
  const [data, setData] = useState<RatingData>({
    averageRating: 4.2,
    reviewCount: 87,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = useMemo(() => {
    if (typeof window !== "undefined") return window.location.origin;
    return process.env.NEXT_PUBLIC_BASE_URL || "";
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!website?._id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/public/widget?websiteId=${website._id.toString()}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        setData({
          averageRating: Number(json.averageRating || 4.2),
          reviewCount: Number(json.reviewCount || 87),
        });
      } catch (e) {
        setError("Failed to load preview");
        // Use demo data on error
        setData({ averageRating: 4.2, reviewCount: 87 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [website?._id]);

  const isDisabled =
    !website?._id || data.reviewCount === 0 || data.averageRating <= 0;

  const handleCopy = async (type: string) => {
    if (!website?._id) return;
    const snippet = getEmbedSnippet(baseUrl, website._id.toString(), type);
    await navigator.clipboard.writeText(snippet);
    setCopied(type);
    toast.success("הקוד הועתק ללוח. הדביקו את הקוד באתר שלכם");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DashboardContainer
      title={"וידג׳ט להטמעה"}
      subtitle={
        "הטמיעו וידג׳ט דירוג מתקדם באתר שלכם והציגו את האמינות שלכם ללקוחות. הווידג׳ט מתעדכן אוטומטית עם הדירוגים החדשים."
      }
    >
      {isDisabled && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-center gap-2 max-w-md">
          <Info className="w-5 h-5" />
          כדי להפעיל את הווידג׳ט, יש צורך בביקורת אחת לפחות.
        </div>
      )}
      <div className="space-y-8">
        {/* Card widget */}
        <div className="flex justify-center">
          <Card
            className={`${
              isDisabled ? "opacity-60" : ""
            } border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm max-w-lg w-full`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-r from-purple-500 to-purple-600">
                  1
                </div>
                <div>
                  <CardTitle className="text-lg">Card - כרטיס אמון</CardTitle>
                  <CardDescription className="text-sm">
                    כרטיס עשיר המציג דירוג, מספר ביקורות וקישור לדף Rate-It
                    שלכם.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="font-semibold mb-4 text-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  תצוגה מקדימה
                </div>
                {loading && (
                  <div className="text-sm text-slate-500 animate-pulse">
                    טוען תצוגה...
                  </div>
                )}
                {error && <div className="text-sm text-red-600">{error}</div>}
                {!loading && (
                  <div className="flex justify-center">
                    <PreviewCard data={data} />
                  </div>
                )}
                {/* Removed caption under preview per request */}
              </div>

              {/* Embed Code */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <div className="font-semibold mb-3 text-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  קוד הטמעה
                </div>
                <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {website?._id
                    ? getEmbedSnippet(baseUrl, website._id.toString(), "card")
                    : ""}
                </pre>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    size="sm"
                    disabled={isDisabled}
                    onClick={() => handleCopy("card")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied === "card" ? "הועתק!" : "העתק קוד"}
                  </Button>
                  <a
                    href="#instructions"
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" /> הוראות הטמעה
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simple widget */}
        <div className="flex justify-center">
          <Card
            className={`${
              isDisabled ? "opacity-60" : ""
            } border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm max-w-lg w-full`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-r from-purple-500 to-purple-600">
                  2
                </div>
                <div>
                  <CardTitle className="text-lg">Simple - כוכבים</CardTitle>
                  <CardDescription className="text-sm">
                    וידג׳ט מינימליסטי עם לוגו וכוכבים, כולל דירוג ומספר ביקורות
                    (ללא TrustScore).
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="font-semibold mb-4 text-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  תצוגה מקדימה
                </div>
                {loading && (
                  <div className="text-sm text-slate-500 animate-pulse">
                    טוען תצוגה...
                  </div>
                )}
                {error && <div className="text-sm text-red-600">{error}</div>}
                {!loading && (
                  <div className="flex justify-center">
                    <PreviewSimple data={data} />
                  </div>
                )}
              </div>

              {/* Embed Code */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <div className="font-semibold mb-3 text-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  קוד הטמעה
                </div>
                <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {website?._id
                    ? getEmbedSnippet(baseUrl, website._id.toString(), "simple")
                    : ""}
                </pre>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    size="sm"
                    disabled={isDisabled}
                    onClick={() => handleCopy("simple")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied === "simple" ? "הועתק!" : "העתק קוד"}
                  </Button>
                  <a
                    href="#instructions"
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" /> הוראות הטמעה
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card
          id="instructions"
          className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">הוראות הטמעה</CardTitle>
                <CardDescription>
                  העתיקו את הקוד והדביקו באתר שלכם למראה מקצועי ואמין
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  שלבי הטמעה
                </h3>
                <ol className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-xs">
                      •
                    </span>
                    היכנסו לאתר שלכם (Wix/WordPress/קוד מותאם)
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-xs">
                      •
                    </span>
                    חפשו &quot;Custom HTML&quot; או &quot;Embed Code&quot;
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-xs">
                      •
                    </span>
                    הדביקו את הקוד שהעתקתם
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-xs">
                      •
                    </span>
                    שמרו ופרסמו את האתר
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </span>
                  יתרונות הווידג׳ט
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">
                      ✓
                    </span>
                    עיצוב מקצועי ואלגנטי
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">
                      ✓
                    </span>
                    עדכון אוטומטי של דירוגים
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">
                      ✓
                    </span>
                    תואם לכל הפלטפורמות
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">
                      ✓
                    </span>
                    טעינה מהירה וביצועים גבוהים
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-purple-700">
                <strong>טיפ למפתחים:</strong> ניתן להטמיע את הסקריפט פעם אחת
                ב-head של האתר וליצור מכולות עם data-attributes מותאמות לכל
                מיקום.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardContainer>
  );
}
