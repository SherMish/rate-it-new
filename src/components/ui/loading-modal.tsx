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
          <DialogTitle>Setting up your dashboard</DialogTitle>
          <DialogDescription>
            We&apos;re analyzing your AI tool and preparing your dashboard. This may take a few minutes. Please don&apos;t close this window.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </DialogContent>
    </Dialog>
  );
} 