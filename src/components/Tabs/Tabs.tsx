import { Tab } from "@headlessui/react";
import React from "react";

type TabsSize = "sm" | "md" | "lg";
type TabsVariant = "underline" | "solid" | "pill";

export interface TabsProps {
  tabs: {
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }[];

  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
}

const sizeClasses: Record<TabsSize, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-5 py-3",
};

const variantClasses: Record<
  TabsVariant,
  { active: string; inactive: string }
> = {
  underline: {
    active:
      "text-blue-600 border-b-2 border-blue-600",
    inactive:
      "text-gray-600 hover:text-gray-800",
  },
  solid: {
    active: "bg-blue-600 text-white",
    inactive:
      "bg-gray-100 text-gray-700 hover:bg-gray-200",
  },
  pill: {
    active: "bg-blue-600 text-white rounded-full",
    inactive:
      "text-gray-700 hover:bg-gray-100 rounded-full",
  },
};

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  variant = "underline",
  size = "md",
  className = "",
}) => {
  return (
    <Tab.Group>
      <div className={className}>
        <Tab.List className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              disabled={tab.disabled}
              className={({ selected }) =>
                [
                  "font-semibold transition-colors focus:outline-none",
                  sizeClasses[size],
                  selected
                    ? variantClasses[variant].active
                    : variantClasses[variant].inactive,
                ].join(" ")
              }
            >
              {tab.label}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-4">
          {tabs.map((tab, index) => (
            <Tab.Panel key={index}>
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
};
Tabs.displayName = "Tabs";