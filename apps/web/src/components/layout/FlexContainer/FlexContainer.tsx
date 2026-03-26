import React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export type FlexContainerVariant =
  | "default"
  | "surface"
  | "muted"
  | "outline"
  | "elevated";

export type FlexContainerPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

const flexContainerVariants = cva(
  [
    "flex transition-[background-color,border-color,box-shadow,transform]",
    "data-[pseudo-state=disabled]:pointer-events-none data-[pseudo-state=disabled]:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "rounded-lg border border-neutral-50/0 bg-neutral-50/0 data-[pseudo-state=hover]:border-neutral-200 data-[pseudo-state=hover]:bg-neutral-100 data-[pseudo-state=hover]:shadow-sm data-[pseudo-state=active]:border-neutral-300 data-[pseudo-state=active]:bg-neutral-200 data-[pseudo-state=active]:shadow-inner data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus]:bg-neutral-50 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/20 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-primary-500 data-[pseudo-state=focus-visible]:bg-neutral-50 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/20 data-[pseudo-state=focus-visible]:ring-offset-2",
        surface:
          "rounded-lg border border-neutral-50/0 bg-neutral-50 hover:bg-neutral-200 data-[pseudo-state=hover]:border-neutral-200 data-[pseudo-state=hover]:bg-neutral-200 data-[pseudo-state=hover]:shadow-sm data-[pseudo-state=active]:border-neutral-300 data-[pseudo-state=active]:bg-neutral-300 data-[pseudo-state=active]:shadow-inner data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/20 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-primary-500 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/20 data-[pseudo-state=focus-visible]:ring-offset-2",
        muted:
          "rounded-lg border border-neutral-50/0 bg-neutral-200 hover:bg-neutral-400 data-[pseudo-state=hover]:border-neutral-400 data-[pseudo-state=hover]:bg-neutral-400 data-[pseudo-state=hover]:shadow-sm data-[pseudo-state=active]:border-neutral-500 data-[pseudo-state=active]:bg-neutral-500 data-[pseudo-state=active]:shadow-inner data-[pseudo-state=focus]:border-neutral-500 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-neutral-400/40 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-neutral-500 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-neutral-400/40 data-[pseudo-state=focus-visible]:ring-offset-2",
        outline:
          "rounded-lg border border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100 hover:shadow-sm data-[pseudo-state=hover]:border-neutral-400 data-[pseudo-state=hover]:bg-neutral-100 data-[pseudo-state=hover]:shadow-sm data-[pseudo-state=active]:border-neutral-500 data-[pseudo-state=active]:bg-neutral-200 data-[pseudo-state=active]:shadow-inner data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus]:bg-neutral-50 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/20 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-primary-500 data-[pseudo-state=focus-visible]:bg-neutral-50 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/20 data-[pseudo-state=focus-visible]:ring-offset-2",
        elevated:
          "rounded-xl border border-neutral-50/0 bg-neutral-50 shadow-md hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-lg data-[pseudo-state=hover]:-translate-y-0.5 data-[pseudo-state=hover]:bg-neutral-50 data-[pseudo-state=hover]:shadow-lg data-[pseudo-state=active]:translate-y-px data-[pseudo-state=active]:bg-neutral-100 data-[pseudo-state=active]:shadow-sm data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus]:bg-neutral-50 data-[pseudo-state=focus]:shadow-lg data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/20 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-primary-500 data-[pseudo-state=focus-visible]:bg-neutral-50 data-[pseudo-state=focus-visible]:shadow-lg data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/20 data-[pseudo-state=focus-visible]:ring-offset-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface FlexContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal or Vertical direction */
  direction?: "row" | "col";

  /** Gap between items (number uses Tailwind spacing convention: 1 = 0.25rem) or any CSS value like '12px', '1rem' */
  gap?: number | string;

  /** Alignment on cross-axis */
  align?: "start" | "center" | "end" | "stretch" | "baseline";

  /** Alignment on main-axis */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";

  /** Flex wrap */
  wrap?: "wrap" | "nowrap" | "wrap-reverse";

  /** Full width container */
  fullWidth?: boolean;

  /** Decorative container variant */
  variant?: FlexContainerVariant;

  /** Preview pseudo state for stories/design review */
  pseudoState?: FlexContainerPseudoState;

  /** Additional class names */
  className?: string;

  /** Children inside the container */
  children: React.ReactNode;
}

/**
 * FlexContainer
 * - Tailwind for direction/justify/align/wrap
 * - Inline style for `gap` to support dynamic values without Tailwind safelist
 */
export const FlexContainer: React.FC<FlexContainerProps> = ({
  direction = "row",
  gap = 0,
  align = "stretch",
  justify = "start",
  wrap = "nowrap",
  fullWidth = false,
  variant = "default",
  pseudoState = "none",
  className = "",
  children,
  style: styleProp,
  ...props
}) => {
  const directionClass = direction === "col" ? "flex-col" : "flex-row";

  const justifyMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  } as const;

  const alignMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  } as const;

  const wrapMap = {
    wrap: "flex-wrap",
    nowrap: "flex-nowrap",
    "wrap-reverse": "flex-wrap-reverse",
  } as const;

  const containerClass = cn(
    flexContainerVariants({ variant }),
    directionClass,
    wrapMap[wrap],
    justifyMap[justify],
    alignMap[align],
    fullWidth && "w-full",
    className,
  );

  // Inline style for dynamic gap:
  // - If number, we follow Tailwind convention where 1 = 0.25rem
  // - If string, we use it as-is (e.g., '10px', '1rem', '2ch', etc.)
  const style: React.CSSProperties = {
    ...styleProp,
    gap: typeof gap === "number" ? `${gap * 0.25}rem` : gap,
  };

  return (
    <div
      className={containerClass}
      style={style}
      data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
      aria-disabled={pseudoState === "disabled" ? true : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

FlexContainer.displayName = "FlexContainer";
