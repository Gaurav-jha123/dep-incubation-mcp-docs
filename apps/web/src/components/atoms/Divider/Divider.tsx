import React from "react";
import { cn } from "../../../lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  // The orientation of the divider. Default: "horizontal"
  orientation?: "horizontal" | "vertical";

  // The size of the divider. Default: "md"
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "border-1 border-solid border-black",
  md: "border-2 border-solid border-black",
  lg: "border-3 border-solid border-black",
};

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    { 
      className, 
      orientation = "horizontal", 
      size="md",
      ...props 
    }, 
    ref
  ) => {
    console.log("Divider props:", { orientation, size, className, props });
    return (
      <div
        ref={ref}
        role={"separator"}
        aria-orientation={ orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";