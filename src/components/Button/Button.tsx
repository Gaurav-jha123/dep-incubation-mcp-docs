import React from "react";
import { Button as HeadlessButton } from "@headlessui/react";
import type { ReactNode } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  isLoading?: boolean;
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded",
  md: "px-4 py-2 text-base rounded-md",
  lg: "px-6 py-3 text-lg rounded-lg",
};

const variantStyles = {
  primary: "bg-primary-500 hover:bg-primary-700 text-secondary-50",
  secondary:
    "bg-secondary-50 border border-secondary-200 text-secondary-700 data-hover:bg-gray-300",
  danger: " bg-danger-500 hover:bg-danger-700 text-secondary-50",
  ghost:
    "text-secondary-700 data-hover:bg-secondary-200 data-active:bg-secondary-200",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const classes = [
      base,
      sizeStyles[size],
      variantStyles[variant],
      className,
    ].join(" ");

    return (
      <HeadlessButton
        ref={ref}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
