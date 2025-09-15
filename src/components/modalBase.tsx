import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  shouldCloseOnOverlayClick?: boolean;
  shouldCloseOnEsc?: boolean;
}

export function Modal({
  children,
  isOpen,
  onRequestClose,
  shouldCloseOnOverlayClick = true,
  shouldCloseOnEsc = true,
}: ModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (shouldCloseOnEsc && event.key === "Escape") {
        onRequestClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onRequestClose, shouldCloseOnEsc]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={shouldCloseOnOverlayClick ? onRequestClose : undefined}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
