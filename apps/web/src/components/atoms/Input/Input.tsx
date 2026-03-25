import React, { useId, useCallback } from "react";
import type { ReactNode } from "react";
import { Field, Input as HeadlessInput, Description } from "@headlessui/react";

export type InputPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

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

const sizeStyles = {
  sm: "h-9 text-sm",
  md: "h-11 text-base",
  lg: "h-12 text-lg",
};

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
      pseudoState = "none",
      id,
      // onClear,
      maxLength,
      showCharCount = false,
      onChange,
      value,
      className = "",
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id || `input-${reactId}`;
    const pseudoStateData = pseudoState === "none" ? undefined : pseudoState;
    const isDisabled = disabled || pseudoState === "disabled";
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 0,
    );

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
        ? "text-sm text-success-900"
        : "text-sm text-neutral-700";

    return (
      <Field
        className={fullWidth ? "w-full" : "w-72"}
        data-pseudo-state={pseudoStateData}
        aria-disabled={isDisabled || undefined}
      >
        {variant === "outlined" ? (
          <div className="relative">
            <HeadlessInput
              ref={ref}
              id={inputId}
              disabled={isDisabled}
              placeholder=" "
              maxLength={maxLength}
              aria-invalid={!!error}
              aria-required={required}
              data-pseudo-state={pseudoStateData}
              className={`peer w-full border rounded-md bg-neutral-50 px-3 pt-4 pb-2 text-neutral-900 outline-none transition-all disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-500 disabled:placeholder:text-neutral-400
              ${sizeStyles[inputSize]}
              ${error ? "border-danger-500 focus:border-danger-500 data-[pseudo-state=focus]:border-danger-500 data-[pseudo-state=focus-visible]:border-danger-500" : "border-neutral-200 hover:border-neutral-300 focus:border-primary-500 data-[pseudo-state=hover]:border-neutral-300 data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus-visible]:border-primary-500"}
              focus:ring-2 focus:ring-primary-500/15 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/15 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/15 data-[pseudo-state=active]:translate-y-px
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${className}`}
              onChange={handleChange}
              value={value}
              {...props}
            />

            {leftIcon && (
              <span
                data-pseudo-state={pseudoStateData}
                className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${
                  isDisabled ? "text-neutral-400" : "text-neutral-700"
                }`}
              >
                {leftIcon}
              </span>
            )}

            {rightIcon && (
              <span
                data-pseudo-state={pseudoStateData}
                className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${
                  isDisabled ? "text-neutral-400" : "text-neutral-700"
                }`}
              >
                {rightIcon}
              </span>
            )}

            {label && (
              <label
                htmlFor={inputId}
                data-pseudo-state={pseudoStateData}
                className={`absolute left-3 z-10 inline-flex max-w-max px-1 ring-2 ring-neutral-50 transition-all ${
                  isDisabled ? "text-neutral-400" : "text-neutral-700"
                }
                peer-placeholder-shown:top-3
                peer-placeholder-shown:text-base
                peer-focus:-top-2
                peer-focus:text-xs
                peer-focus:text-primary-900
                data-[pseudo-state=focus]:-top-2
                data-[pseudo-state=focus]:text-xs
                data-[pseudo-state=focus]:text-primary-900
                data-[pseudo-state=focus-visible]:-top-2
                data-[pseudo-state=focus-visible]:text-xs
                data-[pseudo-state=focus-visible]:text-primary-900
                peer-not-placeholder-shown:-top-2
                peer-not-placeholder-shown:text-xs`}
              >
                {label}
                {required && <span className="ml-1 text-danger-900">*</span>}
              </label>
            )}
          </div>
        ) : (
          <>
            {label && (
              <label
                htmlFor={inputId}
                className={`block text-sm font-medium mb-1 ${
                  isDisabled ? "text-neutral-500" : "text-neutral-700"
                }`}
              >
                {label}
                {required && <span className="ml-1 text-danger-900">*</span>}
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
                data-pseudo-state={pseudoStateData}
                className={`w-full border rounded-md bg-neutral-50 px-3 py-2 text-neutral-900 outline-none transition-colors disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-500 disabled:placeholder:text-neutral-400
                ${error ? "border-danger-500 focus:border-danger-500 data-[pseudo-state=focus]:border-danger-500 data-[pseudo-state=focus-visible]:border-danger-500" : "border-neutral-500 hover:border-neutral-700 focus:border-primary-500 data-[pseudo-state=hover]:border-neutral-700 data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus-visible]:border-primary-500"}
                focus:ring-2 focus:ring-primary-500/15 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/15 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/15 data-[pseudo-state=active]:translate-y-px
                ${leftIcon ? "pl-10" : ""}
                ${rightIcon ? "pr-10" : ""}
                ${className}`}
                onChange={handleChange}
                value={value}
                {...props}
              />

              {leftIcon && (
                <span
                  data-pseudo-state={pseudoStateData}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${
                    isDisabled ? "text-neutral-400" : "text-neutral-700"
                  }`}
                >
                  {leftIcon}
                </span>
              )}

              {rightIcon && (
                <span
                  data-pseudo-state={pseudoStateData}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${
                    isDisabled ? "text-neutral-400" : "text-neutral-700"
                  }`}
                >
                  {rightIcon}
                </span>
              )}
            </div>
          </>
        )}

        {(error || helperText || showCharCount) && (
          <Description as="div" className="mt-1 space-y-1">
            {error && (
              <p className="text-sm text-danger-900 font-medium">{error}</p>
            )}

            {!error && helperText && (
              <p className={helperTextClass}>{helperText}</p>
            )}

            {showCharCount && maxLength && (
              <p
                className={`text-xs ${
                  isCharLimitExceeded ? "text-danger-900" : "text-neutral-700"
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
