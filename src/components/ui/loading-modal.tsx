import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoadingModalProps {
  open: boolean;
}

export function LoadingModal({ open }: LoadingModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>הדשבורד בהכנה!</DialogTitle>
          <DialogDescription>
            אנחנו מעבדים את פרטי העסק ומכינים עבורכם את הדשבורד. זה עשוי להימשך
            כמה דקות – נא לא לסגור את החלון.{" "}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
