"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type User = {
  id: string
  name: string
}

type UserSelectorProps = {
  users: User[]
  selectedUser: string
  onChange: (userId: string) => void
}

export default function UserSelector({
  users,
  selectedUser,
  onChange,
}: UserSelectorProps) {

  const [open, setOpen] = useState(false)

  const selectedUserObj = users.find((u) => u.id === selectedUser)

  return (
    <div className="flex flex-col gap-2 w-[300px]">

      <label htmlFor="user-selector-btn" className="font-semibold">
        Select User
      </label>

      <Popover open={open} onOpenChange={setOpen}>

        <PopoverTrigger asChild>
          <Button
            id="user-selector-btn"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedUserObj ? selectedUserObj.name : "Select user..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0">

          <Command>

            <CommandInput placeholder="Search user..." />

            <CommandEmpty>
              No user found.
            </CommandEmpty>

            <CommandGroup className="max-h-50 overflow-y-auto">

              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => {
                    onChange(user.id)
                    setOpen(false)
                  }}
                >

                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedUser === user.id
                        ? "opacity-100"
                        : "opacity-0"
                      }`}
                  />

                  {user.name}

                </CommandItem>
              ))}

            </CommandGroup>

          </Command>

        </PopoverContent>

      </Popover>

    </div>
  )
}