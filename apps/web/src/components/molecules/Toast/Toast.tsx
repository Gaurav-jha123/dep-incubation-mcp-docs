import React from "react";
import { X, Info } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  onClose?: () => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        // Base styles applied directly. Uses semantic variables for dark mode support.
        className={cn(
          "relative flex w-full sm:w-[400px] items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm transition-all",
          className
        )}
        role="alert"
        {...props}
      >
        {/* A standard, clean Info icon for all messages */}
        <Info className="h-6 w-6 shrink-0 opacity-80" />
        
        <div className="flex-1 flex flex-col gap-0.5 ml-1">
          <h3 className="text-[16px] font-semibold leading-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-[14px] text-muted-foreground leading-tight">
              {description}
            </p>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-muted-foreground transition-opacity hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Close toast"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = "Toast";