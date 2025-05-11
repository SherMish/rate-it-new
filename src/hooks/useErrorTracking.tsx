"use client";

import { useEffect } from "react";

export function useErrorTracking() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      window.alert("🚨 Client Error Captured:" + event.error);

      fetch("/api/send-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ClientError",
          message: event.error?.message || "Unknown client error",
          stack: event.error?.stack || "No stack trace",
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      console.error("🚨 Unhandled Promise Rejection:", event.reason);

      fetch("/api/send-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "UnhandledPromise",
          message: event.reason?.message || "Unhandled promise rejection",
          stack: event.reason?.stack || "No stack trace",
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, []);
}