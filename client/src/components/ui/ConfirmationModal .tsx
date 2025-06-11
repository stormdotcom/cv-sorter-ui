import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function ConfirmationModal({ open, onClose, onConfirm, resume, title, description }: { open: boolean, onClose: () => void, onConfirm: (resume: any) => void, resume: any, title: string, description: string }) {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-primary"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">
          <p>{description}</p>
        </div>
        <div className="flex justify-end mt-6 gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm(resume);
              onClose();
            }}
          >
            Delete
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

export default ConfirmationModal;
