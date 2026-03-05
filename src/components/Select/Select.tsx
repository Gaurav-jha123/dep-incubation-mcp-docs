import React, { useId } from "react";
import { Listbox } from "@headlessui/react";
import type { ReactNode } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  /** List of options */
  options: SelectOption[];

  /** Current value */
  value: string;

  /** Callback when value changes */
  onChange: (value: string) => void;

  /** Select variant style */
  variant?: "default" | "error" | "success";

  /** Size variant */
  selectSize?: "sm" | "md" | "lg";

  /** Label text */
  label?: string;

  /** Error message */
  error?: string;

  /** Helper text */
  helperText?: string;

  /** Full width select */
  fullWidth?: boolean;

  /** Whether field is required */
  required?: boolean;

  /** Additional classes */
  className?: string;

  /** Disabled */
  disabled?: boolean;

  /** Left icon */
  leftIcon?: ReactNode;

  /** Right icon */
  rightIcon?: ReactNode;

  id?: string;
}

/** Reusable Select component using Headless UI */
export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  variant = "default",
  selectSize = "md",
  label,
  error,
  helperText,
  fullWidth = false,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  id,
}) => {
  const reactId = useId();
  const selectId = id || `select-${reactId}`;

  const baseStyles =
    "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-left";

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

  const containerClass = fullWidth ? "w-full" : "";
  const wrapperStyles = "relative flex items-center";
  const buttonStyles = [
    baseStyles,
    sizeStyles[selectSize],
    variantStyles[error ? "error" : variant],
    leftIcon ? "pl-10" : "",
    rightIcon ? "pr-10" : "",
    "w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconBaseClass =
    "absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  const leftIconClass = leftIcon ? `left-3 ${iconBaseClass}` : "";
  const rightIconClass = rightIcon ? `right-3 ${iconBaseClass}` : "";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const helperTextClass = "block text-sm text-gray-500 mt-1";
  const errorClass = "block text-sm text-red-500 font-medium mt-1";

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={selectId} className={labelClass}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className={wrapperStyles}>
          {leftIcon && <span className={leftIconClass}>{leftIcon}</span>}

          <Listbox.Button id={selectId} className={buttonStyles}>
            {options.find((o) => o.value === value)?.label ||
              "Select an option"}
          </Listbox.Button>

          {rightIcon && <span className={rightIconClass}>{rightIcon}</span>}

          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/10 z-10">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-3 ${
                    active ? "bg-blue-100" : "text-gray-900"
                  }`
                }
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      {error && <p className={errorClass}>{error}</p>}
      {!error && helperText && (
        <p className={helperTextClass}>{helperText}</p>
      )}
    </div>
  );
};

Select.displayName = "Select";
