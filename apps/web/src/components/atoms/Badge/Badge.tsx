import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";

import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

export type BadgePseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

export interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  info?: React.ReactNode;
  className?: string;
  pseudoState?: BadgePseudoState;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-primary-200 text-primary-900 hover:bg-primary-400 active:bg-primary-500 data-[pseudo-state=hover]:bg-primary-400 data-[pseudo-state=active]:bg-primary-500",
  success:
    "bg-success-200 text-success-900 hover:bg-success-400 active:bg-success-500 data-[pseudo-state=hover]:bg-success-400 data-[pseudo-state=active]:bg-success-500",
  warning:
    "bg-warning-200 text-warning-900 hover:bg-warning-400 active:bg-warning-500 data-[pseudo-state=hover]:bg-warning-400 data-[pseudo-state=active]:bg-warning-500",
  error:
    "bg-danger-200 text-danger-900 hover:bg-danger-400 active:bg-danger-500 data-[pseudo-state=hover]:bg-danger-400 data-[pseudo-state=active]:bg-danger-500",
  info:
    "bg-neutral-200 text-neutral-900 hover:bg-neutral-400 active:bg-neutral-500 data-[pseudo-state=hover]:bg-neutral-400 data-[pseudo-state=active]:bg-neutral-500",
};

const badgeBaseClasses = [
  "inline-flex items-center rounded px-2 py-1 text-xs font-semibold whitespace-nowrap",
  "transition-[background-color,color,box-shadow,transform] duration-200",
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400/60",
  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500/40",
  "data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus]:ring-neutral-400/60",
  "data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-offset-2 data-[pseudo-state=focus-visible]:ring-primary-500/40",
  "data-[pseudo-state=hover]:-translate-y-0.5 data-[pseudo-state=hover]:shadow-sm",
  "data-[pseudo-state=active]:translate-y-px data-[pseudo-state=active]:shadow-none",
  "data-[pseudo-state=disabled]:cursor-not-allowed data-[pseudo-state=disabled]:opacity-50",
].join(" ");

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = "default",
  info,
  className = "",
  pseudoState = "none",
}) => {
  const pseudoStateData = pseudoState === "none" ? undefined : pseudoState;
  const isDisabled = pseudoState === "disabled";
  const badgeClassName = cn(
    badgeBaseClasses,
    variantClasses[variant] ?? variantClasses.default,
    className,
  );

  if (info) {
    return (
      <Popover className="relative inline-block">
        <Popover.Button
          disabled={isDisabled}
          data-pseudo-state={pseudoStateData}
          className={badgeClassName}
        >
          {text}
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel className="absolute z-10 mt-2 w-40 rounded border border-neutral-200 bg-neutral-50 p-2 text-sm text-neutral-900 shadow-lg">
            {info}
          </Popover.Panel>
        </Transition>
      </Popover>
    );
  }

  return (
    <span
      data-pseudo-state={pseudoStateData}
      aria-disabled={isDisabled || undefined}
      className={badgeClassName}
    >
      {text}
    </span>
  );
};
