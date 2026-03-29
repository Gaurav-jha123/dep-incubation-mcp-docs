"use client"

import { useEffect } from "react"
import { Label } from "@/components/atoms"
import { Select, type Option } from "@/components/organisms/Select/Select"

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

  // Auto-select first user if none selected
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      onChange(users[0].id)
    }
  }, [users, selectedUser, onChange])

  // Convert users → Select options
  const options: Option[] = users.map((user) => ({
    label: user.name,
    value: user.id,
  }))

  return (
    <div className="flex flex-col gap-2 w-75">

      <Label
        htmlFor="user-selector"
        className="font-semibold"
        label="Select User"
      />

      <Select
        options={options}
        value={selectedUser}
        onChange={(value) => onChange(value as string)}
        placeholder={users.length === 0 ? "test user" : "Select user..."}
        searchable={true}
      />

    </div>
  )
}