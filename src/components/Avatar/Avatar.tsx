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
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-yellow-500",
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
      {/* Avatar Circle */}
      <div
        className={`
          rounded-full bg-gray-200 overflow-hidden flex items-center justify-center
          text-gray-700 font-semibold select-none
          ${sizeClass} ${className}
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span>{fallback}</span>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0 
            h-3 w-3 rounded-full border-2 border-white
            ${statusMap[status]}
          `}
        ></span>
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";