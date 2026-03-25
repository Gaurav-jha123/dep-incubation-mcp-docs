import React, { forwardRef, useId } from "react";
import {
  Field,
  Label,
  Description,
  Textarea as HeadlessTextarea,
} from "@headlessui/react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export type TextareaPseudoState =
  | "none"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

const textareaVariants = cva(
  [
    "w-full resize-none border text-neutral-900 placeholder:text-neutral-700",
    "transition-[background-color,border-color,color,box-shadow]",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[pseudo-state=disabled]:cursor-not-allowed data-[pseudo-state=disabled]:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-neutral-500 bg-neutral-50 focus:border-primary-500 focus:ring-primary-500/30 data-[pseudo-state=active]:border-neutral-900 data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/30 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-primary-500 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/30 data-[pseudo-state=focus-visible]:ring-offset-2",
        error:
          "border-danger-500 bg-danger-50 focus:border-danger-500 focus:ring-danger-500/25 data-[pseudo-state=active]:border-danger-900 data-[pseudo-state=focus]:border-danger-500 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-danger-500/25 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-danger-500 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-danger-500/25 data-[pseudo-state=focus-visible]:ring-offset-2",
        success:
          "border-success-500 bg-success-50 focus:border-success-500 focus:ring-success-500/25 data-[pseudo-state=active]:border-success-900 data-[pseudo-state=focus]:border-success-500 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-success-500/25 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-success-500 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-success-500/25 data-[pseudo-state=focus-visible]:ring-offset-2",
        filled:
          "border-neutral-200 bg-neutral-200 shadow-inner focus:border-primary-500 focus:bg-neutral-50 focus:shadow-none focus:ring-primary-500/30 data-[pseudo-state=active]:border-neutral-500 data-[pseudo-state=active]:bg-neutral-200 data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus]:bg-neutral-50 data-[pseudo-state=focus]:shadow-none data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/30 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-primary-500 data-[pseudo-state=focus-visible]:bg-neutral-50 data-[pseudo-state=focus-visible]:shadow-none data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/30 data-[pseudo-state=focus-visible]:ring-offset-2",
      },
      size: {
        sm: "px-2 py-1 text-sm rounded",
        md: "px-3 py-2 text-base rounded-md",
        lg: "px-4 py-3 text-lg rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  textareaSize?: "sm" | "md" | "lg";
  variant?: "default" | "error" | "success" | "filled";
  fullWidth?: boolean;
  required?: boolean;
  rows?: number;
  pseudoState?: TextareaPseudoState;
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
      rows = 3,
      pseudoState = "none",
      className = "",
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const textareaId = id || `textarea-${reactId}`;
    const resolvedVariant = error ? "error" : variant;
    const isDisabled = disabled || pseudoState === "disabled";
    const helperTextClass = cn(
      "mt-1 text-sm",
      resolvedVariant === "success" && "text-success-900",
      resolvedVariant === "error" && "text-danger-900",
      resolvedVariant !== "success" &&
        resolvedVariant !== "error" &&
        "text-neutral-700",
    );

    return (
      <Field className={fullWidth ? "w-full" : undefined}>
        {label && (
          <Label
            htmlFor={textareaId}
            data-testid="textarea-label"
            className={cn(
              "mb-1 block text-sm font-medium text-neutral-700",
              isDisabled && "text-neutral-700",
            )}
          >
            {label}
            {required && <span className="text-danger-900 ml-1">*</span>}
          </Label>
        )}

        <HeadlessTextarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={isDisabled}
          data-testid="textarea"
          data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
          className={cn(
            textareaVariants({ variant: resolvedVariant, size: textareaSize }),
            className,
          )}
          aria-invalid={resolvedVariant === "error"}
          {...props}
        />

        {error ? (
          <Description
            data-testid="textarea-error"
            className="mt-1 text-sm text-danger-900"
          >
            {error}
          </Description>
        ) : (
          helperText && (
            <Description
              data-testid="textarea-helper"
              className={helperTextClass}
            >
              {helperText}
            </Description>
          )
        )}
      </Field>
    );
  },
);

Textarea.displayName = "Textarea";
