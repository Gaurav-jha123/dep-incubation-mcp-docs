import React, { useId } from "react";

import { cn } from "@/lib/utils";

export type CheckboxPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  pseudoState?: CheckboxPseudoState;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  disabled = false,
  onChange,
  className = "",
  pseudoState = "none",
}) => {
  const generatedId = useId();
  const pseudoStateData = pseudoState === "none" ? undefined : pseudoState;
  const isDisabled = disabled || pseudoState === "disabled";

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
      data-pseudo-state={pseudoStateData}
      className={cn(
        "flex items-center gap-2",
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-pseudo-state={pseudoStateData}
        onChange={handleChange}
        className={cn(
          "h-4 w-4 rounded border-neutral-400 accent-primary-500 transition-[box-shadow,transform,filter] duration-200",
          "hover:ring-1 hover:ring-primary-500/30",
          "focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-2 focus:outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2",
          "active:scale-95",
          "data-[pseudo-state=hover]:ring-1 data-[pseudo-state=hover]:ring-primary-500/30",
          "data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/40 data-[pseudo-state=focus]:ring-offset-2",
          "data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/40 data-[pseudo-state=focus-visible]:ring-offset-2",
          "data-[pseudo-state=active]:scale-95",
          "data-[pseudo-state=disabled]:cursor-not-allowed data-[pseudo-state=disabled]:opacity-50",
        )}
      />

      {label && <span className="text-sm text-neutral-900">{label}</span>}
    </label>
  );
};

Checkbox.displayName = "Checkbox";