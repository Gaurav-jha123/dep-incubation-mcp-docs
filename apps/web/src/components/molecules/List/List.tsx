import React from "react";
import { Listbox, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Check } from "lucide-react";

export interface ListItem {
  icon?: React.ReactNode;
  label: string;
  description?: string;
}

export interface ListProps {
  items: ListItem[];
  value?: ListItem;
  onChange?: (item: ListItem) => void;
  variant?: "default" | "bordered" | "card";
  className?: string;
  ariaLabel?: string;
}

export const List: React.FC<ListProps> = ({
  items,
  value,
  onChange,
  variant = "default",
  className = "",
  ariaLabel = "Selectable items",
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
          <ListboxOption key={idx} value={item}>
            {({ active, selected }: { active: boolean; selected: boolean }) => (
              <div
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition cursor-pointer
                  ${selected ? "bg-primary-50 border-primary-400" : "border-neutral-200"}
                  ${active && !selected ? "bg-neutral-50 border-neutral-400" : ""}`}
              >
                {item.icon && (
                  <span className="mt-0.5 text-lg text-neutral-500">
                    {item.icon}
                  </span>
                )}

                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{item.label}</p>

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
                    <Check className="h-4 w-4" data-testid="selected-icon" />
                  </span>
                )}
              </div>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

List.displayName = "List";