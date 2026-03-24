import React from "react";
import { Button as HeadlessButton } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

const buttonLayoutStyles =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap cursor-pointer";

const buttonTransitionStyles =
  "transition-[background-color,border-color,color,box-shadow,transform]";

const buttonFocusStyles =
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400/60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500/40 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus]:ring-neutral-400/60 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-offset-2 data-[pseudo-state=focus-visible]:ring-primary-500/40";

const buttonHoverStyles =
  "hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg hover:ring-1 hover:ring-neutral-900/10 data-[pseudo-state=hover]:-translate-y-0.5 data-[pseudo-state=hover]:scale-[1.02] data-[pseudo-state=hover]:shadow-lg data-[pseudo-state=hover]:ring-1 data-[pseudo-state=hover]:ring-neutral-900/10";

const buttonActiveStyles =
  "active:translate-y-px data-[pseudo-state=active]:translate-y-px disabled:active:translate-y-0";

const buttonDisabledStyles =
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-none disabled:hover:ring-0";

const buttonVariants = cva(
  [
    buttonLayoutStyles,
    buttonTransitionStyles,
    buttonFocusStyles,
    buttonHoverStyles,
    buttonActiveStyles,
    buttonDisabledStyles,
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-neutral-900 hover:bg-primary-700 active:bg-primary-900 active:shadow-none data-[pseudo-state=hover]:bg-primary-700 data-[pseudo-state=active]:bg-primary-900 data-[pseudo-state=active]:shadow-none",
        secondary:
          "border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-400 active:text-neutral-900 active:shadow-none data-[pseudo-state=hover]:bg-neutral-200 data-[pseudo-state=active]:bg-neutral-400 data-[pseudo-state=active]:text-neutral-900 data-[pseudo-state=active]:shadow-none",
        danger:
          "bg-danger-500 text-neutral-900 hover:bg-danger-700 active:bg-danger-900 active:shadow-none data-[pseudo-state=hover]:bg-danger-700 data-[pseudo-state=active]:bg-danger-900 data-[pseudo-state=active]:shadow-none",
        ghost:
          "text-neutral-700 hover:bg-neutral-200 active:bg-neutral-400 active:text-neutral-900 active:shadow-none data-[pseudo-state=hover]:bg-neutral-200 data-[pseudo-state=active]:bg-neutral-400 data-[pseudo-state=active]:text-neutral-900 data-[pseudo-state=active]:shadow-none",
        outline:
          "border border-primary-500 bg-transparent text-primary-900 hover:bg-primary-50 active:bg-primary-200 active:shadow-none data-[pseudo-state=hover]:bg-primary-50 data-[pseudo-state=active]:bg-primary-200 data-[pseudo-state=active]:shadow-none",
        link: "bg-transparent px-0 py-0 text-primary-900 hover:underline hover:decoration-2 active:no-underline active:opacity-80 data-[pseudo-state=hover]:underline data-[pseudo-state=hover]:decoration-2 data-[pseudo-state=active]:no-underline data-[pseudo-state=active]:opacity-80",
      },
      size: {
        sm: "px-3 py-1.5 text-sm rounded",
        md: "px-4 py-2 text-base rounded-md",
        lg: "px-6 py-3 text-lg rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  pseudoState?: ButtonPseudoState;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      pseudoState = "none",
      className = "",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading || pseudoState === "disabled";

    return (
      <HeadlessButton
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="size-4 shrink-0 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="spinner"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              fill="currentColor"
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0A12 12 0 000 12h4z"
            />
          </svg>
        )}

        {children}
      </HeadlessButton>
    );
  },
);

Button.displayName = "Button";
