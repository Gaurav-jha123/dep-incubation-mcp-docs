import React from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";

export type SwitchPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  pseudoState?: SwitchPseudoState;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  className = "",
  label = "toggle switch",
  pseudoState = "none",
}) => {
  const isPseudoDisabled = pseudoState === "disabled";
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      disabled={disabled || isPseudoDisabled}
      aria-label={label}
      data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500 data-[pseudo-state=focus-visible]:ring-offset-2 ${
        checked ? "bg-primary-500" : "bg-neutral-500"
      } ${disabled || isPseudoDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-neutral-50 rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </HeadlessSwitch>
  );
};
