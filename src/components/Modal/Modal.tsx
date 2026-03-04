import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;

  /** Callback when modal closes */
  onClose: () => void;

  /** Title shown in the header */
  title?: string;

  /** Subtitle / description under title */
  description?: string;

  /** The main modal content */
  children: React.ReactNode;

  /** Footer actions (buttons) */
  footer?: React.ReactNode;

  /** Extra class names */
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className = "",
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        
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

        {/* Modal Panel Container */}
        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            
            {/* Panel */}
            <Dialog.Panel
              className={`
                w-full max-w-lg rounded-lg bg-white shadow-xl
                overflow-hidden
                ${className}
              `}
            >
              {/* Header */}
              {(title || description) && (
                <div className="px-6 py-4 border-b border-gray-200">
                  {title && (
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      {title}
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description className="text-sm text-gray-600 mt-1">
                      {description}
                    </Dialog.Description>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-5 text-gray-800">{children}</div>

              {/* Footer */}
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