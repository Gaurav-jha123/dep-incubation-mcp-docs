// Dropdown.tsx
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react"
import { ChevronDownIcon } from "lucide-react"
import React, { createContext, useContext } from "react"
import { cn } from "@/lib/utils"

type Placement = "bottom-start" | "bottom-end" | "top-start" | "top-end"
type Size = "sm" | "md" | "lg"

// ─── Context ─────────────────────────────────────────────────────────────
interface DropdownContextValue {
  size: Size
}

const DropdownContext = createContext<DropdownContextValue>({
  size: "md",
})

const useDropdownContext = () => useContext(DropdownContext)

// ─── Placement Styles ────────────────────────────────────────────────────
const placementStyles: Record<Placement, string> = {
  "bottom-start": "left-0 mt-2",
  "bottom-end": "right-0 mt-2",
  "top-start": "left-0 bottom-full mb-2",
  "top-end": "right-0 bottom-full mb-2",
}

// ─── Size Styles ─────────────────────────────────────────────────────────
const triggerSizes: Record<Size, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
}

const itemSizes: Record<Size, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
}

// ─── Root ────────────────────────────────────────────────────────────────
interface RootProps {
  children: React.ReactNode
  className?: string
  size?: Size
}

const Root: React.FC<RootProps> = ({
  children,
  className,
  size = "md",
}) => {
  return (
    <DropdownContext.Provider value={{ size }}>
      <div
        data-testid="dropdown-root"
        className={cn("relative inline-block", className)}
      >
        <Menu>{children}</Menu>
      </div>
    </DropdownContext.Provider>
  )
}

// ─── Trigger ─────────────────────────────────────────────────────────────
interface TriggerProps {
  children: React.ReactNode
  className?: string
  showChevron?: boolean
  size?: Size // optional override
}

const Trigger: React.FC<TriggerProps> = ({
  children,
  className,
  showChevron = true,
  size: sizeProp,
}) => {
  const { size: contextSize } = useDropdownContext()
  const size = sizeProp ?? contextSize

  return (
    <MenuButton
      data-testid="dropdown-trigger"
      className={cn(
        "inline-flex items-center rounded-md gap-2 bg-neutral-50 border border-neutral-300 text-neutral-700 hover:bg-neutral-100",
        triggerSizes[size],
        className
      )}
    >
      {children}
      {showChevron && <ChevronDownIcon className="w-4 h-4 text-neutral-700" />}
    </MenuButton>
  )
}

// ─── Content ─────────────────────────────────────────────────────────────
interface ContentProps {
  children: React.ReactNode
  placement?: Placement
  className?: string
}

const Content: React.FC<ContentProps> = ({
  children,
  placement = "bottom-start",
  className,
}) => {
  return (
    <MenuItems
      data-testid="dropdown-content"
      className={cn(
        "absolute z-50 min-w-[180px] rounded-md border border-neutral-300 bg-neutral-50 shadow-lg p-1",
        placementStyles[placement],
        className
      )}
    >
      {children}
    </MenuItems>
  )
}

// ─── Item ────────────────────────────────────────────────────────────────
interface ItemProps {
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  size?: Size // optional override
}

const Item: React.FC<ItemProps> = ({
  children,
  icon,
  onClick,
  disabled,
  className,
  size: sizeProp,
}) => {
  const { size: contextSize } = useDropdownContext()
  const size = sizeProp ?? contextSize

  return (
    <MenuItem disabled={disabled}>
      <button
        data-testid="dropdown-item"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full text-left rounded-md flex items-center gap-2 data-[focus]:bg-neutral-400 cursor-pointer",
          itemSizes[size],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    </MenuItem>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────
interface DividerProps {
  className?: string
}

const Divider: React.FC<DividerProps> = ({ className }) => {
  return (
    <div
      data-testid="dropdown-separator"
      className={cn("my-1 h-px bg-neutral-500", className)}
    />
  )
}

// ─── Export ──────────────────────────────────────────────────────────────
export const Dropdown = Object.assign(Root, {
  Trigger,
  Content,
  Item,
  Divider,
})