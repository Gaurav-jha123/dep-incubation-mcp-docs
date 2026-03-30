import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export type ToastPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

const toastVariants = cva(
  [
    "relative flex w-full items-start gap-3 border shadow-sm transition-[background-color,border-color,color,box-shadow,transform,opacity]",
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-neutral-400/60",
    "data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus]:ring-neutral-400/60",
    "data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-offset-2 data-[pseudo-state=focus-visible]:ring-primary-500/40",
    "data-[pseudo-state=hover]:-translate-y-0.5 data-[pseudo-state=hover]:shadow-lg",
    "data-[pseudo-state=active]:translate-y-px data-[pseudo-state=active]:shadow-none",
    "data-[pseudo-state=disabled]:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        info:
          "border-primary-200 bg-primary-50 text-primary-950 data-[pseudo-state=hover]:bg-primary-100",
        success:
          "border-success-200 bg-success-50 text-success-950 data-[pseudo-state=hover]:bg-success-100",
        warning:
          "border-warning-200 bg-warning-50 text-warning-950 data-[pseudo-state=hover]:bg-warning-100",
        danger:
          "border-danger-200 bg-danger-50 text-danger-950 data-[pseudo-state=hover]:bg-danger-100",
      },
      size: {
        sm: "rounded-lg px-3 py-2.5 sm:w-[320px]",
        md: "rounded-xl px-4 py-3 sm:w-[400px]",
        lg: "rounded-2xl px-5 py-4 sm:w-[460px]",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  },
);

const iconContainerVariants = cva("mt-0.5 shrink-0", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
    },
    variant: {
      info: "text-primary-700",
      success: "text-success-700",
      warning: "text-warning-700",
      danger: "text-danger-700",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "info",
  },
});

const titleVariants = cva("font-semibold leading-tight", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const descriptionVariants = cva("leading-snug opacity-85", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const closeButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-md transition-[background-color,color,box-shadow,transform,opacity]",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400/60",
    "hover:bg-black/5 data-[pseudo-state=hover]:bg-black/5",
    "active:translate-y-px data-[pseudo-state=active]:translate-y-px",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-7",
        md: "size-8",
        lg: "size-9",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const iconByVariant = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
} as const;

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
  pseudoState?: ToastPseudoState;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className = "",
      title,
      description,
      onClose,
      icon,
      variant = "info",
      size = "md",
      pseudoState = "none",
      ...props
    },
    ref,
  ) => {
    const Icon = iconByVariant[variant ?? "info"];
    const isDisabled = pseudoState === "disabled";

    return (
      <div
        ref={ref}
        aria-live="polite"
        data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
        className={cn(
          toastVariants({ variant, size }),
          className,
        )}
        role="alert"
        {...props}
      >
        {icon ?? <Icon aria-hidden="true" className={iconContainerVariants({ size, variant })} />}

        <div className="ml-1 flex flex-1 flex-col gap-0.5">
          <h3
            className={titleVariants({ size })}
            style={variant === "info" ? { color: "var(--color-primary-900)" } : undefined}
          >
            {title}
          </h3>
          {description && (
            <p className={descriptionVariants({ size })}>
              {description}
            </p>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isDisabled}
            data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
            className={closeButtonVariants({ size })}
            aria-label="Close toast"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = "Toast";