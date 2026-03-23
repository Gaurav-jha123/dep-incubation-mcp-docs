import React from "react";

export interface AvatarProps {
  /** Image source */
  src?: string;

  /** Fallback initials if image fails or missing */
  fallback?: string;

  /** Size of avatar */
  size?: "sm" | "md" | "lg" | "xl";

  /** Status indicator */
  status?: "online" | "offline" | "busy" | "away";

  /** Extra styles */
  className?: string;

  /** Alt text */
  alt?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-xl",
};

const statusMap = {
  online: "bg-success-500",
  offline: "bg-neutral-500",
  busy: "bg-danger-500",
  away: "bg-warning-500",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  fallback,
  size = "md",
  status,
  className = "",
  alt = "avatar",
}) => {
  const sizeClass = sizeMap[size];

  return (
    <div className="relative inline-block">
      <div
        className={`
          overflow-hidden rounded-full bg-neutral-200 text-neutral-700
          flex items-center justify-center font-semibold select-none
          ${sizeClass} ${className}
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span>{fallback}</span>
        )}
      </div>

      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            h-3 w-3 rounded-full border-2 border-background
            ${statusMap[status]}
          `}
        />
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";