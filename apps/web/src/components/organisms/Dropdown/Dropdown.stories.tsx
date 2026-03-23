import type { Meta, StoryObj } from "@storybook/react-vite"
import { Dropdown } from "./Dropdown"
import {
  ArrowRight,
  CogIcon,
  Copy,
  Ellipsis,
  Headset,
  PencilIcon,
  Settings,
  SquareArrowRight,
  SquareUser,
  TrashIcon,
  UserIcon,
} from "lucide-react"
import { Avatar } from "../../atoms/Avatar/Avatar"

const meta: Meta<typeof Dropdown> = {
  title: "Organisms/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A composable dropdown menu using Trigger, Content, Item and Divider.",
      },
    },
  },
  argTypes: {
    className: { description: "Extra Tailwind or CSS classes", control: "text" },
    children: { description: "Dropdown structure with Trigger and Content", control: false },
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

// ─── Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>Options</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={() => alert("Edit")}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={() => alert("Duplicate")}>Duplicate</Dropdown.Item>
        <Dropdown.Item onClick={() => alert("Delete")}>Delete</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── With Icons ──────────────────────────────────────────────────────────────
export const WithIcons: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>My Account</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item icon={<UserIcon className="w-4 h-4 text-neutral-700" />}>Profile</Dropdown.Item>
        <Dropdown.Item icon={<CogIcon className="w-4 h-4 text-neutral-700" />}>Settings</Dropdown.Item>
        <Dropdown.Item icon={<ArrowRight className="w-4 h-4 text-neutral-700" />}>Sign out</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── With Disabled Items ─────────────────────────────────────────────────────
export const WithDisabledItems: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>Actions</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
        <Dropdown.Item disabled>Delete (no permission)</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── Placements ───────────────────────────────────────────────────────────────
export const PlacementBottomEnd: Story = {
  name: "Placement: bottom-end",
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>Bottom End</Dropdown.Trigger>
      <Dropdown.Content placement="bottom-end">
        <Dropdown.Item>Item one</Dropdown.Item>
        <Dropdown.Item>Item two</Dropdown.Item>
        <Dropdown.Item>Item three</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

export const PlacementTopStart: Story = {
  name: "Placement: top-start",
  parameters: { layout: "padded" },
  decorators: [(Story) => <div className="flex items-end justify-center h-48"><Story /></div>],
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>Top Start</Dropdown.Trigger>
      <Dropdown.Content placement="top-start">
        <Dropdown.Item>Item one</Dropdown.Item>
        <Dropdown.Item>Item two</Dropdown.Item>
        <Dropdown.Item>Item three</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

export const PlacementTopEnd: Story = {
  name: "Placement: top-end",
  parameters: { layout: "padded" },
  decorators: [(Story) => <div className="flex items-end justify-center h-48"><Story /></div>],
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>Top End</Dropdown.Trigger>
      <Dropdown.Content placement="top-end">
        <Dropdown.Item>Item one</Dropdown.Item>
        <Dropdown.Item>Item two</Dropdown.Item>
        <Dropdown.Item>Item three</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── Icon-Only Trigger (Kebab Menu) ──────────────────────────────────────────
export const IconOnlyTrigger: Story = {
  name: "Icon-only trigger (kebab)",
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>
        <Ellipsis className="w-5 h-5 text-neutral-700" />
      </Dropdown.Trigger>
      <Dropdown.Content placement="bottom-end">
        <Dropdown.Item icon={<PencilIcon className="w-4 h-4 text-neutral-700" />}>Rename</Dropdown.Item>
        <Dropdown.Item icon={<Copy className="w-4 h-4 text-neutral-700" />}>Copy link</Dropdown.Item>
        <Dropdown.Item icon={<TrashIcon className="w-4 h-4 text-red-600" />} className="text-red-600 data-[focus]:bg-red-50">Delete</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── Profile Dropdown Menu ──────────────────────────────────────────
export const ProfileDropdownMenu: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/ct-assets/team-4.jpg" className="w-5 h-5" />
      </Dropdown.Trigger>
      <Dropdown.Content placement="bottom-end">
        <Dropdown.Item icon={<SquareUser className="w-4 h-4 text-neutral-700" />}>My Profile</Dropdown.Item>
        <Dropdown.Item icon={<Settings className="w-4 h-4 text-neutral-700" />}>Edit Profile</Dropdown.Item>
        <Dropdown.Item icon={<Headset className="w-4 h-4 text-red-600" />} className="text-red-600 data-[focus]:bg-red-50">Support</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item icon={<SquareArrowRight className="w-4 h-4 text-neutral-700" />}>Sign out</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── Long List ────────────────────────────────────────────────────────────────
export const LongList: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>Select country</Dropdown.Trigger>
      <Dropdown.Content className="max-h-56 overflow-y-auto">
        {["Australia","Brazil","Canada","Denmark","Egypt","Finland","Germany","Hungary","India","Japan","Kenya","Luxembourg"].map((country) => (
          <Dropdown.Item key={country}>{country}</Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── With Divider ─────────────────────────────────────────────────────────────
export const WithDivider: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>My Account</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Profile</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Sign out</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── Sizes ───────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      
      {/* Small */}
      <Dropdown size="sm">
        <Dropdown.Trigger>Small</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>

      {/* Medium (default) */}
      <Dropdown size="md">
        <Dropdown.Trigger>Medium</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>

      {/* Large */}
      <Dropdown size="lg">
        <Dropdown.Trigger>Large</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>

    </div>
  ),
}