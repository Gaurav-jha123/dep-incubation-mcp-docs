import React, { useEffect, useId, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type TooltipPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

const tooltipTriggerStyles =
  "inline-block rounded-sm focus:outline-none focus-visible:outline-none";

const tooltipPanelVariants = cva(
  [
    "fixed z-50 max-w-xs shadow-lg transition-[opacity,transform,box-shadow] duration-150",
    "data-[state=open]:opacity-100 data-[state=open]:scale-100",
    "data-[state=closed]:opacity-0 data-[state=closed]:scale-95",
    "data-[pseudo-state=hover]:-translate-y-0.5 data-[pseudo-state=hover]:shadow-xl",
    "data-[pseudo-state=active]:translate-y-px",
    "data-[pseudo-state=disabled]:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-neutral-50",
        subtle: "border border-neutral-200 bg-neutral-50 text-neutral-900",
      },
      size: {
        sm: "rounded px-2 py-1 text-xs",
        md: "rounded-md px-2.5 py-1.5 text-sm",
        lg: "rounded-lg px-3 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content"
>,
    VariantProps<typeof tooltipPanelVariants> {
  /** The content to display inside the tooltip */
  content: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: number;
  disabled?: boolean;
  pseudoState?: TooltipPseudoState;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      placement = "top",
      offset = 8,
      disabled = false,
      className = "",
      variant = "default",
      size = "md",
      pseudoState = "none",
      ...rest
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number }>({
      top: 0,
      left: 0,
    });

    const tooltipId = useId();
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const isDisabled = disabled || pseudoState === "disabled";
    const previewVisible =
      pseudoState === "hover" ||
      pseudoState === "active" ||
      pseudoState === "focus" ||
      pseudoState === "focus-visible";
    const isOpen = !isDisabled && (visible || previewVisible);

    const setTriggerRef = (node: HTMLDivElement | null) => {
      triggerRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const show = () => {
      if (!isDisabled) {
        setVisible(true);
      }
    };

    const hide = () => setVisible(false);

    useEffect(() => {
      if (!isOpen) return;

      const compute = () => {
        const trigger = triggerRef.current;
        const tooltip = tooltipRef.current;
        if (!(trigger && tooltip)) return;

        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (placement) {
          case "top":
            top = triggerRect.top - tooltipRect.height - offset;
            left =
              triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
            break;
          case "bottom":
            top = triggerRect.bottom + offset;
            left =
              triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
            break;
          case "left":
            top =
              triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
            left = triggerRect.left - tooltipRect.width - offset;
            break;
          case "right":
            top =
              triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
            left = triggerRect.right + offset;
            break;
        }

        setCoords({
          top: Math.max(0, top),
          left: Math.max(0, left),
        });
      };

      compute();
      window.addEventListener("resize", compute);
      window.addEventListener("scroll", compute, true);

      return () => {
        window.removeEventListener("resize", compute);
        window.removeEventListener("scroll", compute, true);
      };
    }, [isOpen, placement, offset]);

    return (
      <>
        <div
          ref={setTriggerRef}
          onMouseEnter={show}
          onMouseLeave={hide}
          onFocus={show}
          onBlur={hide}
          className={tooltipTriggerStyles}
          aria-describedby={isOpen ? tooltipId : undefined}
          data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
        >
          {children}
        </div>

        {isOpen &&
          createPortal(
            <div
              id={tooltipId}
              ref={tooltipRef}
              role="tooltip"
              style={{ top: coords.top, left: coords.left }}
              data-state={isOpen ? "open" : "closed"}
              data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
              className={cn(
                tooltipPanelVariants({ variant, size }),
                className,
              )}
              {...rest}
            >
              {content}
            </div>,
            document.body,
          )}
      </>
    );
  },
);

Tooltip.displayName = "Tooltip";