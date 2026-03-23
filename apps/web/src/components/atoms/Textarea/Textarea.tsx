import React, { forwardRef } from "react";
import {
  Field,
  Label,
  Description,
  Textarea as HeadlessTextarea,
} from "@headlessui/react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  textareaSize?: "sm" | "md" | "lg";
  variant?: "default" | "error" | "success";
  fullWidth?: boolean;
  required?: boolean;
  rows?: 3,
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      textareaSize = "md",
      variant = "default",
      fullWidth = false,
      required = false,
      rows= 3,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none";

    const sizeStyles = {
      sm: "px-2 py-1 text-sm rounded",
      md: "px-3 py-2 text-base rounded-md",
      lg: "px-4 py-3 text-lg rounded-lg",
    };

    const variantStyles = {
      default:
        "border border-neutral-700 bg-white text-neutral-900 focus:ring-primary-500",
      error:
        "border border-danger-500 bg-danger-50 text-neutral-900 focus:ring-danger-500",
      success:
        "border border-success-500 bg-success-50 text-neutral-900 focus:ring-success-500",
    };

    const textareaClass = [
      baseStyles,
      sizeStyles[textareaSize],
      variantStyles[error ? "error" : variant],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    const helperTextClass =
      variant === "success" ? "text-sm text-success-700 mt-1" : "text-sm text-neutral-700 mt-1";

    return (
      <Field className={fullWidth ? "w-full" : ""}>
        {label && (
          <Label data-testid="textarea-label" className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </Label>
        )}

        <HeadlessTextarea
          ref={ref}
          rows={rows}
          data-testid="textarea"
          className={textareaClass}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />

        {error ? (
          <Description data-testid="textarea-error" className="text-sm text-danger-500 mt-1">
            {error}
          </Description>
        ) : (
          helperText && (
            <Description data-testid="textarea-helper" className={helperTextClass}>
              {helperText}
            </Description>
          )
        )}
      </Field>
    );
  }
);

Textarea.displayName = "Textarea";