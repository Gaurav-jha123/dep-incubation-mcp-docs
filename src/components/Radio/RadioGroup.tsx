import React, { useState } from "react";
import {
  RadioGroup as HeadlessRadioGroup,
  Field,
  Radio,
  Label,
} from "@headlessui/react";

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name?: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  defaultValue,
  onChange,
  size = "md",
  className = "",
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const selectedValue = value ?? internalValue;

  const sizeStyles = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <HeadlessRadioGroup
      value={selectedValue}
      onChange={(val) => {
        setInternalValue(val);
        onChange?.(val);
      }}
      className={className}
      name={name}
      data-testid="radio-group"
    >
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <Field
            key={option.value}
            disabled={option.disabled}
            className="flex items-center gap-2"
          >
            <Radio
              value={option.value}
              className={({ checked, disabled }) =>
                [
                  sizeStyles[size],
                  "border border-gray-300 rounded-full",
                  checked ? "bg-blue-600 border-blue-600" : "bg-white",
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            />
            <Label className="text-gray-800 select-none">{option.label}</Label>
          </Field>
        ))}
      </div>
    </HeadlessRadioGroup>
  );
};
