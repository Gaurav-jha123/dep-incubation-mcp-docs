import React, { useId, useCallback } from "react";
import type { ReactNode } from "react";
import {
  Field,
  Input as HeadlessInput,
  Description,
} from "@headlessui/react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
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
    const descriptionId = `${inputId}-description`;
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

    const isCharLimitExceeded =
      maxLength && charCount > maxLength;

    return (
      <Field className={fullWidth ? "w-full" : "w-72"}>
        {variant === "outlined" ? (
          <div className="relative">
            <HeadlessInput
              ref={ref}
              id={inputId}
              disabled={disabled}
              placeholder=" "
              maxLength={maxLength}
              aria-describedby={
                error || helperText || showCharCount ? descriptionId : undefined
              }
              aria-invalid={!!error}
              aria-required={required}
              className={`peer w-full border rounded-md bg-white px-3 pt-4 pb-2 outline-none transition-all
              ${sizeStyles[inputSize]}
              ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"}
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${className}`}
              onChange={handleChange}
              value={value}
              {...props}
            />

            {leftIcon && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-gray-400">
                {leftIcon}
              </span>
            )}

            {rightIcon && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-gray-400">
                {rightIcon}
              </span>
            )}

            {label && (
              <label
                htmlFor={inputId}
                className="absolute left-3 bg-white px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-3
                peer-placeholder-shown:text-base
                peer-focus:-top-2
                peer-focus:text-xs
                peer-focus:text-blue-600
                peer-not-placeholder-shown:-top-2
                peer-not-placeholder-shown:text-xs"
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
          </div>
        ) : (
          <>
            {label && (
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            <div className="relative">
              <HeadlessInput
                ref={ref}
                id={inputId}
                disabled={disabled}
                maxLength={maxLength}
                aria-describedby={
                  error || helperText || showCharCount
                    ? descriptionId
                    : undefined
                }
                aria-invalid={!!error}
                aria-required={required}
                className={`w-full border rounded-md px-3 py-2 outline-none transition-colors
                ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"}
                ${leftIcon ? "pl-10" : ""}
                ${rightIcon ? "pr-10" : ""}
                ${className}`}
                onChange={handleChange}
                value={value}
                {...props}
              />

              {leftIcon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-gray-400">
                  {leftIcon}
                </span>
              )}

              {rightIcon && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-gray-400">
                  {rightIcon}
                </span>
              )}
            </div>
          </>
        )}

        {(error || helperText || showCharCount) && (
          <Description as="div" id={descriptionId} className="mt-1 space-y-1">
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            {!error && helperText && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}

            {showCharCount && maxLength && (
              <p
                className={`text-xs ${
                  isCharLimitExceeded ? "text-red-500" : "text-gray-400"
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
