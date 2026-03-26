import React from "react";

export type CardPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

export interface CardProps {
  /** Card variant */
  variant?: "simple" | "header" | "image" | "actions" | "styled";

  /** The title for cards with headers */
  title?: string;

  /** Optional subtitle */
  subtitle?: string;

  /** Image URL for image variant */
  imageSrc?: string;

  /** Image alt text */
  imageAlt?: string;

  /** Action buttons (for actions variant) */
  actions?: React.ReactNode;

  /** Card content */
  children?: React.ReactNode;

  /** Style variant types */
  styleVariant?: "solid" | "outline" | "ghost";

  /** Extra classes */
  className?: string;

  /** Preview pseudo states in Storybook */
  pseudoState?: CardPseudoState;
}

export const Card: React.FC<CardProps> = ({
  variant = "simple",
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  actions,
  styleVariant = "solid",
  children,
  className = "",
  pseudoState = "none",
}) => {
  const pseudoStateData = pseudoState === "none" ? undefined : pseudoState;
  const base =
    "rounded-lg overflow-hidden border border-border bg-card shadow-sm transition-[background-color,border-color,box-shadow,transform,opacity] data-[pseudo-state=hover]:border-neutral-400 data-[pseudo-state=hover]:bg-neutral-50 data-[pseudo-state=hover]:shadow-md data-[pseudo-state=active]:translate-y-px data-[pseudo-state=active]:border-neutral-700 data-[pseudo-state=active]:bg-neutral-50 data-[pseudo-state=active]:shadow-sm data-[pseudo-state=focus]:border-neutral-500 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-neutral-400/60 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus-visible]:border-primary-500 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/40 data-[pseudo-state=focus-visible]:ring-offset-2 data-[pseudo-state=disabled]:bg-neutral-50 data-[pseudo-state=disabled]:opacity-60";

  const styledVariants = {
    solid: "bg-card border border-border shadow-md",
    outline: "border border-border bg-transparent shadow-none",
    ghost: "bg-transparent border-none shadow-none",
  };

  return (
    <div
      data-pseudo-state={pseudoStateData}
      aria-disabled={pseudoState === "disabled" || undefined}
      className={`${base} ${variant === "styled" ? styledVariants[styleVariant] : ""} ${className}`}
    >
      {/* Image Variant */}
      {variant === "image" && imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full object-cover h-48"
        />
      )}

      {/* Header Variant */}
      {variant === "header" || variant === "actions" ? (
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      ) : null}

      {/* Content */}
      <div className="p-4 text-foreground">{children}</div>

      {/* Actions Variant */}
      {variant === "actions" && actions && (
        <div className="p-4 border-t border-border flex justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

Card.displayName = "Card";
