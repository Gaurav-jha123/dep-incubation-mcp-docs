import React, { useId } from "react";

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  disabled = false,
  onChange,
  className = "",
}) => {

  const generatedId = useId();

  const id = label
    ? `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}-${generatedId}`
    : generatedId;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    onChange?.(checked);
  };

  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-disabled={disabled}
        onChange={handleChange}
        className="w-4 h-4 accent-primary-500"
      />

      {label && <span className="text-sm text-neutral-900">{label}</span>}
    </label>
  );
};

Checkbox.displayName = "Checkbox";