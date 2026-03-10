import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

  title?: string;
  description?: string;
  showCancelButton?: boolean;

  children: React.ReactNode;
  footer?: React.ReactNode;

  size?: "sm" | "md" | "lg" | "xl";

  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  showCancelButton = false,
  children,
  footer,
  size = "md",
  className = "",
}) => {
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={`
                w-full
                ${sizeStyles[size]}
                max-h-[calc(100vh-2rem)]
                flex flex-col
                rounded-lg
                bg-white
                shadow-xl
                overflow-hidden
                ${className}
              `}
            >
              {(title || description || showCancelButton) && (
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-3">
                    {title ? (
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        {title}
                      </Dialog.Title>
                    ) : (
                      <div />
                    )}
                    {showCancelButton && (
                      <button
                        type="button"
                        aria-label="Close modal"
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                        onClick={onClose}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {description && (
                    <Dialog.Description className="text-sm text-gray-600 mt-1">
                      {description}
                    </Dialog.Description>
                  )}
                </div>
              )}

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 text-gray-800">
                {children}
              </div>

              {footer && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  {footer}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.displayName = "Modal";