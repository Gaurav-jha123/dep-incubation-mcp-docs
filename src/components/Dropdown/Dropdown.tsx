import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react"
import React from "react"
import { cn } from "@/lib/utils"

type Placement = "bottom-start" | "bottom-end" | "top-start" | "top-end"

const placementStyles: Record<Placement, string> = {
  "bottom-start": "left-0 mt-2",
  "bottom-end": "right-0 mt-2",
  "top-start": "left-0 bottom-full mb-2",
  "top-end": "right-0 bottom-full mb-2",
}

interface RootProps {
  children: React.ReactNode
  className?: string
}

const Root: React.FC<RootProps> = ({ children, className }) => {
  return (
    <Menu as="div" data-testid="dropdown-root" className={cn("relative inline-block", className)}>
      {children}
    </Menu>
  )
}

interface TriggerProps {
  children: React.ReactNode
  className?: string
}

const Trigger: React.FC<TriggerProps> = ({ children, className }) => {
  return (
    <MenuButton
      data-testid="dropdown-trigger"
      className={cn(
        "inline-flex items-center px-4 py-2 text-sm rounded-md",
        className
      )}
    >
      {children}
    </MenuButton>
  )
}

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
        "absolute z-50 min-w-[180px] rounded-md border bg-white shadow-lg p-1",
        placementStyles[placement],
        className
      )}
    >
      {children}
    </MenuItems>
  )
}

interface ItemProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

const Item: React.FC<ItemProps> = ({
  children,
  onClick,
  disabled,
  className,
}) => {
  return (
    <MenuItem disabled={disabled}>
      <button
        data-testid="dropdown-item"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full text-left px-3 py-2 text-sm rounded-md",
          "data-[focus]:bg-gray-100",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {children}
      </button>
    </MenuItem>
  )
}

interface DividerProps {
  className?: string
}

const Divider: React.FC<DividerProps> = ({ className }) => {
  return <div data-testid="dropdown-separator" className={cn("my-1 h-px bg-gray-100", className)} />
}

export const Dropdown = Object.assign(Root, {
  Trigger,
  Content,
  Item,
  Divider,
})

