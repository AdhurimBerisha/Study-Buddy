import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  closeOnOverlayClick = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnOverlayClick &&
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${sizes[size]} w-full max-h-[90vh] overflow-hidden relative border border-gray-200 dark:border-gray-700`}
        role="document"
      >
        {(title || closeOnOverlayClick) && (
          <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between p-4 sm:p-6">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 pr-8"
                >
                  {title}
                </h2>
              )}
              {closeOnOverlayClick && (
                <button
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 group text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-110"
                  onClick={onClose}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
