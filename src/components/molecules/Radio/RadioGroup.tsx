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
                  "rounded-full border border-neutral-400",
                  checked
                    ? "border-primary-200 bg-primary-700"
                    : "bg-neutral-50",
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            />
            <Label className="select-none text-neutral-700">
              {option.label}
            </Label>
          </Field>
        ))}
      </div>
    </HeadlessRadioGroup>
  );
};
