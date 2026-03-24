import React from "react";

export interface FlexContainerProps {
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
  className = "",
  children,
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

  const containerClass = [
    "flex",
    directionClass,
    wrapMap[wrap],
    justifyMap[justify],
    alignMap[align],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Inline style for dynamic gap:
  // - If number, we follow Tailwind convention where 1 = 0.25rem
  // - If string, we use it as-is (e.g., '10px', '1rem', '2ch', etc.)
  const style: React.CSSProperties = {
    gap: typeof gap === "number" ? `${gap * 0.25}rem` : gap,
  };

  return (
    <div className={containerClass} style={style}>
      {children}
    </div>
  );
};

FlexContainer.displayName = "FlexContainer";