import React, { useId } from "react";
import type { ReactNode } from "react";
import {
  Field,
  Label,
  Input as HeadlessInput,
  Description,
} from "@headlessui/react";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  variant?: "default" | "error" | "success";
  inputSize?: "sm" | "md" | "lg";
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      inputSize = "md",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      required = false,
      className = "",
      disabled = false,
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id || `input-${reactId}`;

    const baseStyles =
      "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed w-full";

    const sizeStyles = {
      sm: "px-2 py-1 text-sm rounded",
      md: "px-3 py-2 text-base rounded-md",
      lg: "px-4 py-3 text-lg rounded-lg",
    };

    const variantStyles = {
      default:
        "border border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500",
      error:
        "border border-red-500 bg-red-50 text-gray-900 hover:border-red-600 focus:ring-red-500 focus:border-red-500",
      success:
        "border border-green-500 bg-green-50 text-gray-900 hover:border-green-600 focus:ring-green-500 focus:border-green-500",
    };

    const wrapperStyles = "relative flex items-center";

    const inputClass = [
      baseStyles,
      sizeStyles[inputSize],
      variantStyles[error ? "error" : variant],
      leftIcon ? "pl-10" : "",
      rightIcon ? "pr-10" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const iconBase = "absolute top-1/2 -translate-y-1/2 text-gray-400";
    const leftIconClass = leftIcon ? `left-3 ${iconBase}` : "";
    const rightIconClass = rightIcon ? `right-3 ${iconBase}` : "";

    const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
    const helperClass = "text-sm text-gray-500 mt-1";
    const errorClass = "text-sm text-red-500 font-medium mt-1";

    return (
      <Field className={fullWidth ? "w-full" : ""}>
        {label && (
          <Label htmlFor={inputId} className={labelClass}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}

        <div className={wrapperStyles}>
          {leftIcon && <span className={leftIconClass}>{leftIcon}</span>}

          <HeadlessInput
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={inputClass}
            aria-invalid={error ? "true" : "false"}
            {...props}
          />

          {rightIcon && <span className={rightIconClass}>{rightIcon}</span>}
        </div>

        {error && (
          <Description as="p" className={errorClass}>
            {error}
          </Description>
        )}

        {!error && helperText && (
          <Description as="p" className={helperClass}>
            {helperText}
          </Description>
        )}
      </Field>
    );
  },
);

Input.displayName = "Input";
