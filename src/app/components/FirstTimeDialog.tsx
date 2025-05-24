"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useSpring, animated } from "@react-spring/web";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Edit, ArrowRight } from "lucide-react";
import Image from "next/image";

interface FirstTimeDialogProps {
  userName?: string;
  open: boolean;
  onClose: () => void;
}

export function FirstTimeDialog({
  userName,
  open,
  onClose,
}: FirstTimeDialogProps) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const titleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 300,
  });

  const contentAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
    delay: 500,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {open && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <DialogContent className="max-w-md">
        <animated.div style={titleAnimation}>
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold" dir="rtl">
              מזל טוב, {userName || "משתמש יקר"}! 🎉
            </DialogTitle>
          </DialogHeader>
        </animated.div>

        <animated.div style={contentAnimation}>
          <DialogDescription className="text-center text-base" dir="rtl">
            ברכות על הצטרפותך למערכת! העסק שלך עכשיו מופיע במערכת ואנשים יכולים
            לראות אותו.
            <br />
            <br />
            <span className="font-semibold">הצעד הבא</span>: עדכן את פרטי העסק
            שלך כדי להגדיל את הנראות והאמינות של העסק שלך.
          </DialogDescription>

          <div
            className="my-6 border border-primary/20 bg-primary/5 rounded-lg p-4 flex items-start gap-3"
            dir="rtl"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
              <Edit className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">טיפ:</h4>
              <p className="text-sm text-muted-foreground mt-1">
                עבור ל<span className="font-semibold">דף העסק</span> כדי להוסיף
                מידע חשוב כמו תיאור העסק, לוגו וקישורים לרשתות חברתיות!
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col gap-3 sm:flex-row" dir="rtl">
            <Button className="w-full gradient-button" onClick={onClose}>
              עדכון פרטי העסק
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </animated.div>
      </DialogContent>
    </Dialog>
  );
}

export default FirstTimeDialog;
