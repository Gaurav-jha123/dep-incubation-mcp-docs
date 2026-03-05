import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";

type AlertType = "success" | "error" | "warning" | "info";
type IconKey = AlertType | "close";

interface AlertProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "style"
> {
  type?: AlertType;
  message: string;
  isOpen?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

const alertVariantClasses: Record<AlertType, string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

const icons: Record<IconKey, React.ReactNode> = {
  success: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 9v4m0 4h.01M4.93 19h14.14c.86 0 1.4-.93.97-1.67L12.97 5.3a1.1 1.1 0 00-1.94 0L3.96 17.33c-.43.74.11 1.67.97 1.67z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8h.01M11 11h1v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  close: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  message,
  isOpen = true,
  closable = false,
  onClose,
  children,
  className = "",
  ...rest
}) => {
  const baseClasses =
    "my-2 flex items-start gap-3 rounded-md border px-4 py-3 text-sm font-medium";
  const closeButtonClasses =
    "ml-1 inline-flex h-6 w-6 items-center justify-center rounded text-current transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2";
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const combinedClassName = [baseClasses, alertVariantClasses[type], className]
    .filter(Boolean)
    .join(" ");

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <Transition
      as={Fragment}
      show={isVisible}
      enter="transform transition duration-200 ease-out"
      enterFrom="opacity-0 -translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transform transition duration-150 ease-in"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 -translate-y-1"
    >
      <div className={combinedClassName} role="alert" {...rest}>
        <span className="mt-0.5 flex shrink-0 items-center">{icons[type]}</span>
        <span className="flex-1">{children ?? message}</span>
        {closable && (
          <button
            type="button"
            onClick={handleClose}
            className={closeButtonClasses}
            aria-label="Close alert"
          >
            {icons.close}
          </button>
        )}
      </div>
    </Transition>
  );
};
