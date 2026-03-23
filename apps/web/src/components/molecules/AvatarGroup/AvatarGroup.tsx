import React from "react";
import { Avatar, type AvatarProps } from "../../atoms/Avatar/Avatar";

export interface AvatarGroupProps {
  avatars: AvatarProps[];
  maxVisible?: number;
  size?: "sm" | "md" | "lg" | "xl";
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  maxVisible = 5,
  size = "md",
}) => {
  const visible = avatars.slice(0, maxVisible);
  const remaining = avatars.length - maxVisible;

  return (
    <div className="flex -space-x-3 items-center">
      {visible.map((a, i) => (
        <Avatar
          key={i}
          {...a}
          size={size}
          className="border-2 border-background"
        />
      ))}

      {remaining > 0 && (
        <div
          className={`
            flex items-center justify-center rounded-full 
            border-2 border-background bg-neutral-400 font-medium text-neutral-900
            ${size === "sm" ? "h-8 w-8" : ""}
            ${size === "md" ? "h-10 w-10" : ""}
            ${size === "lg" ? "h-14 w-14" : ""}
            ${size === "xl" ? "h-20 w-20" : ""}
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";