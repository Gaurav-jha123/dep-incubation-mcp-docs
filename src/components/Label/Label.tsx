import { Label as HeadlessLabel } from "@headlessui/react";
import React from "react";

export interface LabelProps {
  /** The text for the label */
  label?: string;

  /** The id of the associated field */
  htmlFor?: string;

  /** Mark field as required */
  required?: boolean;

  /** Helper text below label */
  helperText?: string;

  /** Error text */
  error?: string;

  /** Additional classes */
  className?: string;
}

/** Reusable Headless UI Label Component */
export const Label: React.FC<LabelProps> = ({
  label,
  htmlFor,
  required = false,
  helperText,
  error,
  className = "",
}) => {
  if (!label) return null;

  const labelClass = [
    "text-sm font-medium",
    error ? "text-red-600" : "text-gray-700",
    "mb-1.5",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const helperClass = "text-xs text-gray-500 mt-1";
  const errorClass = "text-xs text-red-500 font-medium mt-1";

  return (
    <div>
      <HeadlessLabel htmlFor={htmlFor} className={labelClass}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </HeadlessLabel>

      {error ? (
        <p className={errorClass}>{error}</p>
      ) : helperText ? (
        <p className={helperClass}>{helperText}</p>
      ) : null}
    </div>
  );
};

Label.displayName = "Label";