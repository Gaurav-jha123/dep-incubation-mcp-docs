import React from "react";
import { Listbox } from "@headlessui/react";

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
}

export const List: React.FC<ListProps> = ({
  items,
  value,
  onChange,
  variant = "default",
  className = "",
}) => {
  const listVariants = {
    default: "space-y-2",
    bordered: "border border-gray-200 rounded-lg divide-y",
    card: "space-y-3",
  };

  return (
    <Listbox value={value} onChange={onChange}>
      <ul className={`${listVariants[variant]} ${className}`}>
        {items.map((item, idx) => (
          <Listbox.Option key={idx} value={item} as="li">
            {({ active, selected }) => (
              <div
                className={`flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer
                ${active ? "bg-gray-50 border-gray-300" : "border-gray-200"}
                ${selected ? "bg-blue-50 border-blue-300" : ""}`}
              >
                {item.icon && (
                  <span className="text-gray-500 text-lg mt-0.5">
                    {item.icon}
                  </span>
                )}

                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{item.label}</p>

                  {item.description && (
                    <p className="text-gray-600 text-sm mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>

                {selected && (
                  <span className="text-blue-600 text-sm font-medium">✓</span>
                )}
              </div>
            )}
          </Listbox.Option>
        ))}
      </ul>
    </Listbox>
  );
};

List.displayName = "List";