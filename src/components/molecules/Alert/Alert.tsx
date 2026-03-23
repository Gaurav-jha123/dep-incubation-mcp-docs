import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

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
  success: "border-success-500 bg-success-50 text-success-900",
  error: "border-danger-500 bg-danger-50 text-danger-900",
  warning: "border-warning-500 bg-warning-50 text-warning-900",
  info: "border-primary-500 bg-primary-50 text-primary-900",
};
const icons: Record<IconKey, React.ReactNode> = {
  success: <CheckCircle2 size={20} aria-hidden="true" />,
  error: <AlertCircle size={20} aria-hidden="true" />,
  warning: <AlertTriangle size={20} aria-hidden="true" />,
  info: <Info size={20} aria-hidden="true" />,
  close: <X size={16} aria-hidden="true" />,
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
    "ml-1 -mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded text-current transition-colors hover:bg-neutral-900/10 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2";
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
        <span className="flex shrink-0 items-center text-current">{icons[type]}</span>
        <span className="flex-1 text-current">{children ?? message}</span>
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
