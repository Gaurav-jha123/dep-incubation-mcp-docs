"use client"

import { useState, useEffect } from "react"
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

  // Auto-select first user if users are available and none selected
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      onChange(users[0].id)
    }
  }, [users, selectedUser, onChange])

  const selectedUserObj = users.find((u) => u.id === selectedUser)

  return (
    <div className="flex flex-col gap-2 w-75">

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
            {selectedUserObj ? selectedUserObj.name : users.length === 0 ? "test user" : "Select user..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-75 p-0">

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