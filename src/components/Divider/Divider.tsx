import React from "react";
import { cn } from "../../lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  // The orientation of the divider. Default: "horizontal"
  orientation?: "horizontal" | "vertical";

  // Whether the component is purely decorative. If true, accessibility attributes are removed. Default: true
  decorative?: boolean;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    { 
      className, 
      orientation = "horizontal", 
      decorative = true, 
      ...props 
    }, 
    ref
  ) => {
    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";