import React from "react";
import { Disclosure } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "caption"
  | "lead"
  | "overline";

export type TypographyPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

interface TypographyProps {
  /** typography variant: h1, h2, h3, h4, h5, h6, body, caption */
  variant?: TypographyVariant;

  /** content inside typography */
  children: React.ReactNode;

  className?: string;

  /** makes heading collapsible */
  collapsible?: boolean;

  pseudoState?: TypographyPseudoState;
}

const typographyVariants = cva(
  [
    "rounded-sm text-balance transition-[color,opacity,box-shadow]",
    "data-[pseudo-state=hover]:text-primary-900",
    "data-[pseudo-state=active]:text-primary-900",
    "data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-primary-500/30 data-[pseudo-state=focus]:ring-offset-2",
    "data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/30 data-[pseudo-state=focus-visible]:ring-offset-2",
    "data-[pseudo-state=disabled]:text-neutral-700",
  ].join(" "),
  {
    variants: {
      variant: {
        h1: "text-4xl font-bold tracking-tight text-neutral-900",
        h2: "text-3xl font-bold tracking-tight text-neutral-900",
        h3: "text-2xl font-bold tracking-tight text-neutral-900",
        h4: "text-xl font-bold text-neutral-900",
        h5: "text-lg font-semibold text-neutral-900",
        h6: "text-base font-semibold text-neutral-900",
        body: "text-base text-neutral-900",
        caption: "text-sm text-neutral-700",
        lead: "text-lg text-neutral-700",
        overline:
          "text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700",
      },
    },
    defaultVariants: {
      variant: "body",
    },
  },
);

const variantElementMap: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body: "p",
  caption: "p",
  lead: "p",
  overline: "span",
};

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  children,
  className = "",
  collapsible = false,
  pseudoState = "none",
}) => {
  const typographyClassName = cn(
    typographyVariants({ variant }),
    collapsible &&
      "inline-flex items-center gap-2 text-left focus:outline-none",
    className,
  );

  if (collapsible) {
    return (
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              disabled={pseudoState === "disabled"}
              data-pseudo-state={
                pseudoState === "none" ? undefined : pseudoState
              }
              className={typographyClassName}
            >
              {children}
              <ChevronUpIcon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  open && "rotate-180",
                )}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 py-2 text-neutral-700 bg-neutral-50 rounded mt-2">
              Additional content goes here
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  }

  const Component = variantElementMap[variant];

  return (
    <Component
      className={typographyClassName}
      data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
    >
      {children}
    </Component>
  );
};
