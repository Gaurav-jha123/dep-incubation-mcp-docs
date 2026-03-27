import React, { useId, useCallback } from "react";
import type { ReactNode } from "react";
import { Field, Input as HeadlessInput, Description } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type InputPseudoState =
  | "none"
  | "focus"
  | "focus-visible"
  | "disabled"
  | "required";

const inputVariants = cva(
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
        outlined:
          "border border-neutral-200 bg-neutral-200 shadow-inner focus:border-primary-500 focus:bg-neutral-50 focus:shadow-none focus:ring-primary-500/30 data-[pseudo-state=active]:border-neutral-500 data-[pseudo-state=active]:bg-neutral-200 data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus]:bg-neutral-50 data-[pseudo-state=focus]:shadow-none data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/30 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-primary-500 data-[pseudo-state=focus-visible]:bg-neutral-50 data-[pseudo-state=focus-visible]:shadow-none data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/30 data-[pseudo-state=focus-visible]:ring-offset-2",
      },
      size: {
        sm: "h-9 text-sm px-2 py-4",
        md: "h-11 text-base px-2 py-5",
        lg: "h-12 text-lg px-2 py-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  variant?: "default" | "error" | "success" | "outlined";
  inputSize?: "sm" | "md" | "lg";
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  required?: boolean;
  onClear?: () => void;
  maxLength?: number;
  showCharCount?: boolean;
  pseudoState?: InputPseudoState;
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
      disabled = false,
      id,
      // onClear,
      maxLength,
      showCharCount = false,
      onChange,
      value,
      className = "",
      pseudoState = "none",
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id || `input-${reactId}`;
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 0,
    );
    const resolvedVariant = error ? "error" : variant;

    const isDisabled = disabled || pseudoState === "disabled";

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharCount(e.target.value.length);
        onChange?.(e);
      },
      [onChange],
    );

    const isCharLimitExceeded = maxLength && charCount > maxLength;
    const helperTextClass =
      variant === "success"
        ? "text-sm text-success-700"
        : "text-sm text-neutral-500";

    return (
      <Field className={fullWidth ? "w-full" : "w-72"}>
        <>
          {label && (
            <label
              htmlFor={inputId}
              className={`block text-sm font-medium mb-1 ${
                isDisabled ? "text-neutral-500" : "text-neutral-700"
              }`}
            >
              {label}
              {required && <span className="text-danger-500 ml-1">*</span>}
            </label>
          )}

          <div className="relative">
            <HeadlessInput
              ref={ref}
              id={inputId}
              disabled={isDisabled}
              maxLength={maxLength}
              aria-invalid={!!error}
              aria-required={required}
              data-pseudo-state={
                pseudoState === "none" ? undefined : pseudoState
              }
              className={`${cn(
                  inputVariants({
                    variant: resolvedVariant,
                    size: inputSize,
                  }),
                  className,
                )},
                ${leftIcon ? "pl-10" : ""}
                ${rightIcon ? "pr-10" : ""}`}
              onChange={handleChange}
              value={value}
              {...props}
            />

            {leftIcon ? (
              <span
                className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${
                  isDisabled ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                {leftIcon}
              </span>
            ) : (
              ""
            )}

            {rightIcon && (
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${
                  isDisabled ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                {rightIcon}
              </span>
            )}
          </div>
        </>

        {(error || helperText || showCharCount) && (
          <Description className="mt-1 space-y-1">
            {error && (
              <p className="text-sm text-danger-500 font-medium">{error}</p>
            )}

            {!error && helperText && (
              <p className={helperTextClass}>{helperText}</p>
            )}

            {showCharCount && maxLength && (
              <p
                className={`text-xs ${
                  isCharLimitExceeded ? "text-danger-500" : "text-neutral-500"
                }`}
              >
                {charCount} / {maxLength}
              </p>
            )}
          </Description>
        )}
      </Field>
    );
  },
);

Input.displayName = "Input";