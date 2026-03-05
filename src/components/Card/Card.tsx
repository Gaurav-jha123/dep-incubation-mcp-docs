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
  const base = "rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200";

  const styledVariants = {
    solid: "bg-white border border-gray-200 shadow-md",
    outline: "border border-gray-300 bg-transparent shadow-none",
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
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      ) : null}

      {/* Content */}
      <div className="p-4 text-gray-700">{children}</div>

      {/* Actions Variant */}
      {variant === "actions" && actions && (
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

Card.displayName = "Card";