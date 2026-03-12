import React, { useState, useRef, useEffect } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /** The content to display inside the tooltip */
  content: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  offset = 8,
  disabled = false,
  className = "",
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const show = () => !disabled && setVisible(true);
  const hide = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;

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
            triggerRect.left +
            triggerRect.width / 2 -
            tooltipRect.width / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + offset;
          left =
            triggerRect.left +
            triggerRect.width / 2 -
            tooltipRect.width / 2;
          break;
        case "left":
          top =
            triggerRect.top +
            triggerRect.height / 2 -
            tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - offset;
          break;
        case "right":
          top =
            triggerRect.top +
            triggerRect.height / 2 -
            tooltipRect.height / 2;
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
  }, [visible, placement, offset]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-block"
        tabIndex={0}
        aria-describedby={visible ? "tooltip-panel" : undefined}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            id="tooltip-panel"
            ref={tooltipRef}
            role="tooltip"
            style={{ top: coords.top, left: coords.left }}
            className={[
              "fixed z-50 max-w-xs px-2 py-1 text-sm bg-secondary-900 text-secondary-50 rounded shadow transition-opacity duration-150",
              "opacity-100 animate-fadeIn",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...rest}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};