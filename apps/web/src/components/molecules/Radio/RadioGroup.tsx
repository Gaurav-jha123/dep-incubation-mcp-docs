import React, { useState } from "react";
import {
  RadioGroup as HeadlessRadioGroup,
  Field,
  Radio,
  Label,
} from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

export type RadioGroupPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

const groupStyles = "flex flex-col gap-2";

const fieldStyles = "flex items-center gap-3";

const radioTransitionStyles =
  "transition-[background-color,border-color,box-shadow,transform]";

const radioFocusStyles =
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400/60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500/40 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus]:ring-neutral-400/60 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-offset-2 data-[pseudo-state=focus-visible]:ring-primary-500/40";

const radioHoverStyles =
  "hover:border-primary-500 hover:bg-primary-50 data-[pseudo-state=hover]:border-primary-500 data-[pseudo-state=hover]:bg-primary-50";

const radioActiveStyles =
  "active:scale-95 data-[pseudo-state=active]:scale-95 disabled:active:scale-100";

const radioDisabledStyles =
  "disabled:cursor-not-allowed disabled:opacity-50";

const radioIndicatorVariants = cva(
  [
    "rounded-full border border-neutral-400 bg-neutral-50 shrink-0",
    radioTransitionStyles,
    radioFocusStyles,
    radioHoverStyles,
    radioActiveStyles,
    radioDisabledStyles,
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">,
    VariantProps<typeof radioIndicatorVariants> {
  name?: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  pseudoState?: RadioGroupPseudoState;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      options,
      value,
      defaultValue,
      onChange,
      size = "md",
      disabled = false,
      pseudoState = "none",
      className = "",
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : internalValue;
    const isDisabled = disabled || pseudoState === "disabled";

    return (
      <HeadlessRadioGroup
        ref={ref}
        value={selectedValue}
        onChange={(nextValue: string) => {
          if (!isControlled) {
            setInternalValue(nextValue);
          }

          onChange?.(nextValue);
        }}
        className={cn(groupStyles, className)}
        name={name}
        disabled={isDisabled}
        data-testid="radio-group"
        {...props}
      >
        {options.map((option) => {
          const optionDisabled = isDisabled || option.disabled;

          return (
            <Field
              key={option.value}
              disabled={optionDisabled}
              className={cn(
                fieldStyles,
                optionDisabled ? "cursor-not-allowed" : "cursor-pointer",
              )}
            >
              <Radio
                value={option.value}
                data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
                className={({ checked, disabled: radioDisabled }) =>
                  cn(
                    radioIndicatorVariants({ size }),
                    checked
                      ? "border-primary-200 bg-primary-700 shadow-[inset_0_0_0_2px_theme(colors.neutral.50)]"
                      : "bg-neutral-50",
                    radioDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer",
                  )
                }
              />
              <Label
                data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
                className={cn(
                  "select-none text-neutral-700",
                  optionDisabled && "cursor-not-allowed opacity-50",
                  !optionDisabled &&
                    "data-[pseudo-state=hover]:text-neutral-900 data-[pseudo-state=active]:text-neutral-900",
                )}
              >
                {option.label}
              </Label>
            </Field>
          );
        })}
      </HeadlessRadioGroup>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
