import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function ConsultationSuccessModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] text-center">
        <DialogHeader className="items-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <DialogTitle className="text-2xl font-bold">Success!</DialogTitle>
          <DialogDescription className="text-lg">
            Your consultation request has been submitted successfully. We've
            received your request and will get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
