import { Tab } from "@headlessui/react";
import React from "react";

type TabsSize = "sm" | "md" | "lg";
type TabsVariant = "underline" | "solid" | "pill";
export type TabsPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

export interface TabsProps {
  tabs: {
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }[];

  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  pseudoState?: TabsPseudoState;
  pseudoStateTarget?: number;
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
    active: "text-primary-900 border-b-2 border-primary-700",
    inactive:
      "text-neutral-700 hover:text-neutral-900 data-[pseudo-state=hover]:text-neutral-900 data-[pseudo-state=active]:text-neutral-900",
  },
  solid: {
    active: "bg-primary-900 text-neutral-50",
    inactive:
      "bg-neutral-200 text-neutral-900 hover:bg-neutral-400 data-[pseudo-state=hover]:bg-neutral-400 data-[pseudo-state=active]:bg-neutral-500",
  },
  pill: {
    active: "rounded-full bg-primary-900 text-neutral-50",
    inactive:
      "text-neutral-700 hover:bg-neutral-200 rounded-full data-[pseudo-state=hover]:bg-neutral-200 data-[pseudo-state=active]:bg-neutral-300",
  },
};

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  variant = "underline",
  size = "md",
  className = "",
  pseudoState = "none",
  pseudoStateTarget = 1,
}) => {
  return (
    <Tab.Group>
      <div className={className}>
        <Tab.List className="flex gap-2 border-b border-neutral-200">
          {tabs.map((tab, index) =>
            (() => {
              const pseudoStateData =
                index === pseudoStateTarget && pseudoState !== "none"
                  ? pseudoState
                  : undefined;
              const isDisabled = tab.disabled || pseudoStateData === "disabled";

              return (
                <Tab
                  key={index}
                  disabled={isDisabled}
                  data-pseudo-state={pseudoStateData}
                  className={({ selected }) =>
                    [
                      "font-semibold transition-[background-color,color,box-shadow,transform] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-neutral-400/60 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/40 data-[pseudo-state=focus-visible]:ring-offset-2 data-[pseudo-state=active]:translate-y-px",
                      sizeClasses[size],
                      selected
                        ? variantClasses[variant].active
                        : variantClasses[variant].inactive,
                    ].join(" ")
                  }
                >
                  {tab.label}
                </Tab>
              );
            })(),
          )}
        </Tab.List>

        <Tab.Panels className="mt-4">
          {tabs.map((tab, index) => (
            <Tab.Panel key={index}>{tab.content}</Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
};
Tabs.displayName = "Tabs";
