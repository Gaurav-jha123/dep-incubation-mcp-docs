import React from "react";
import { Listbox, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Check } from "lucide-react";

export type ListPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

export interface ListItem {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ListProps {
  items: ListItem[];
  value?: ListItem;
  onChange?: (item: ListItem) => void;
  variant?: "default" | "bordered" | "card";
  className?: string;
  ariaLabel?: string;
  pseudoState?: ListPseudoState;
  pseudoStateTarget?: number;
}

export const List: React.FC<ListProps> = ({
  items,
  value,
  onChange,
  variant = "default",
  className = "",
  ariaLabel = "Selectable items",
  pseudoState = "none",
  pseudoStateTarget = 1,
}) => {
  const listVariants = {
    default: "space-y-2",
    bordered: "divide-y rounded-lg border border-border",
    card: "space-y-3",
  };

  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxOptions
        static
        aria-label={ariaLabel}
        className={`${listVariants[variant]} ${className}`}
      >
        {items.map((item, idx) => (
          <ListboxOption
            key={idx}
            value={item}
            disabled={
              item.disabled ||
              (pseudoState === "disabled" && idx === pseudoStateTarget)
            }
          >
            {({ active, selected }: { active: boolean; selected: boolean }) =>
              (() => {
                const pseudoStateData =
                  idx === pseudoStateTarget && pseudoState !== "none"
                    ? pseudoState
                    : undefined;
                const isDisabled =
                  item.disabled || pseudoStateData === "disabled";
                const isActive =
                  active ||
                  pseudoStateData === "hover" ||
                  pseudoStateData === "active";

                return (
                  <div
                    data-pseudo-state={pseudoStateData}
                    aria-disabled={isDisabled || undefined}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition cursor-pointer
                    ${selected ? "border-primary-400 bg-primary-50" : "border-neutral-200 bg-neutral-50"}
                    ${pseudoStateData === "hover" && !selected ? "border-neutral-500 bg-neutral-200 shadow-sm" : ""}
                    ${isActive && pseudoStateData !== "hover" && !selected ? "border-neutral-700 bg-neutral-200 shadow-sm" : ""}
                    ${pseudoStateData === "active" ? "translate-y-px" : ""}
                    ${pseudoStateData === "focus" ? "border-neutral-500 ring-2 ring-neutral-400/60 ring-offset-2" : ""}
                    ${pseudoStateData === "focus-visible" ? "border-primary-500 ring-2 ring-primary-500/40 ring-offset-2" : ""}
                    ${isDisabled ? "cursor-not-allowed border-neutral-200 bg-neutral-200 opacity-60" : ""}`}
                  >
                    {item.icon && (
                      <span className="mt-0.5 text-lg text-neutral-500">
                        {item.icon}
                      </span>
                    )}

                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">
                        {item.label}
                      </p>

                      {item.description && (
                        <p className="mt-0.5 text-sm text-neutral-700">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {selected && (
                      <span
                        className="text-sm font-medium text-primary-700"
                        aria-hidden="true"
                      >
                        <Check
                          className="h-4 w-4"
                          data-testid="selected-icon"
                        />
                      </span>
                    )}
                  </div>
                );
              })()
            }
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

List.displayName = "List";
