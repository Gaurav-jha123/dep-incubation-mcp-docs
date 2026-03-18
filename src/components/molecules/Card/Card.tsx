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
    "rounded-lg overflow-hidden bg-neutral-50 shadow-sm border border-neutral-200";

  const styledVariants = {
    solid: "bg-neutral-50 border border-neutral-200 shadow-md",
    outline: "border border-neutral-400 bg-transparent shadow-none",
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
        <div className="p-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-700">{subtitle}</p>
          )}
        </div>
      ) : null}

      {/* Content */}
      <div className="p-4 text-neutral-700">{children}</div>

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