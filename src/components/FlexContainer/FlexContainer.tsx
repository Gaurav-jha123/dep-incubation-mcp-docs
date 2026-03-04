import React from "react";

export interface FlexContainerProps {
  /** Horizontal or Vertical direction */
  direction?: "row" | "col";

  /** Gap between items */
  gap?: number | string;

  /** Alignment on cross-axis */
  align?: "start" | "center" | "end" | "stretch" | "baseline";

  /** Alignment on main-axis */
  justify?:
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly";

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
 * Reusable Flex Container component using Tailwind CSS.
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
  const baseStyles = "flex";

  const directionClass = `flex-${direction}`;
  const wrapClass = wrap ? `flex-${wrap}` : "";
  const gapClass = typeof gap === "number" ? `gap-${gap}` : `gap-[${gap}]`;

  const justifyMap: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const alignMap: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const containerClass = [
    baseStyles,
    directionClass,
    wrapClass,
    justifyMap[justify],
    alignMap[align],
    gapClass,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={containerClass}>{children}</div>;
};

FlexContainer.displayName = "FlexContainer";