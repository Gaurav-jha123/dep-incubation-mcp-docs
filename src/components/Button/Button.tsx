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
  primary:
    "bg-blue-600 text-white data-hover:bg-blue-500 data-active:bg-blue-700",
  secondary:
    "bg-gray-200 text-gray-800 data-hover:bg-gray-300 data-active:bg-gray-400",
  danger: "bg-red-600 text-white data-hover:bg-red-500 data-active:bg-red-700",
  ghost: "text-gray-700 data-hover:bg-gray-100 data-active:bg-gray-200",
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
