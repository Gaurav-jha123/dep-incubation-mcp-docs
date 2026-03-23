import React from "react";

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
}) => {
  const base =
    "rounded-lg overflow-hidden bg-card shadow-sm border border-border";

  const styledVariants = {
    solid: "bg-card border border-border shadow-md",
    outline: "border border-border bg-transparent shadow-none",
    ghost: "bg-transparent border-none shadow-none",
  };

  return (
    <div className={`${base} ${variant === "styled" ? styledVariants[styleVariant] : ""} ${className}`}>
      
      {/* Image Variant */}
      {variant === "image" && imageSrc && (
        <img src={imageSrc} alt={imageAlt} className="w-full object-cover h-48" />
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