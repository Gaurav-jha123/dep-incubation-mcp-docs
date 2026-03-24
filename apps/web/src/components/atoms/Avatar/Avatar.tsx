import React from "react";

import { cn } from "@/lib/utils";

export type AvatarPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

export interface AvatarProps {
  /** Image source */
  src?: string;

  /** Size of avatar */
  size?: "sm" | "md" | "lg" | "xl";

  /** Status indicator */
  status?: "online" | "offline" | "busy" | "away";

  /** Forced visual state for Storybook previews */
  pseudoState?: AvatarPseudoState;

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
  size = "md",
  status,
  pseudoState = "none",
  className = "",
  alt = "avatar",
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const sizeClass = sizeMap[size];
  const pseudoStateData = pseudoState === "none" ? undefined : pseudoState;
  const showImage = Boolean(src) && !imageFailed;

  return (
    <div
      data-pseudo-state={pseudoStateData}
      aria-disabled={pseudoState === "disabled" || undefined}
      className={cn(
        "relative inline-block rounded-full",
        "data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-neutral-400/60 data-[pseudo-state=focus]:ring-offset-2",
        "data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-primary-500/40 data-[pseudo-state=focus-visible]:ring-offset-2",
      )}
    >
      <div
        data-pseudo-state={pseudoStateData}
        aria-disabled={pseudoState === "disabled" || undefined}
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-full bg-neutral-200 font-semibold text-neutral-700 select-none",
          "transition-[transform,box-shadow,filter,opacity] duration-200",
          "hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-neutral-100 hover:shadow-lg hover:ring-1 hover:ring-neutral-900/10 hover:[&_img]:brightness-110",
          "active:translate-y-px active:scale-[0.98] active:bg-neutral-300 active:shadow-none active:ring-1 active:ring-neutral-900/5 active:[&_img]:brightness-95",
          "data-[pseudo-state=hover]:-translate-y-0.5 data-[pseudo-state=hover]:scale-[1.03] data-[pseudo-state=hover]:bg-neutral-100 data-[pseudo-state=hover]:shadow-lg data-[pseudo-state=hover]:ring-1 data-[pseudo-state=hover]:ring-neutral-900/10 data-[pseudo-state=hover]:[&_img]:brightness-110",
          "data-[pseudo-state=active]:translate-y-px data-[pseudo-state=active]:scale-[0.98] data-[pseudo-state=active]:bg-neutral-300 data-[pseudo-state=active]:shadow-none data-[pseudo-state=active]:ring-1 data-[pseudo-state=active]:ring-neutral-900/5 data-[pseudo-state=active]:[&_img]:brightness-95",
          "data-[pseudo-state=disabled]:cursor-not-allowed data-[pseudo-state=disabled]:opacity-50 data-[pseudo-state=disabled]:grayscale",
          sizeClass,
          className,
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-[filter] duration-200"
          />
        ) : (
          <span>{alt}</span>
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