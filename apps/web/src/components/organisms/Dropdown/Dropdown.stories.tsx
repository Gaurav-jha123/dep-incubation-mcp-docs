import type { Meta, StoryObj } from "@storybook/react-vite"
import { userEvent } from "storybook/test"
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

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const

const stateMatrix = [
  { label: "Default", pseudoState: "none" as const },
  { label: "Hover", pseudoState: "hover" as const },
  { label: "Active", pseudoState: "active" as const },
  { label: "Focus", pseudoState: "focus" as const },
  { label: "Focus Visible", pseudoState: "focus-visible" as const },
  { label: "Disabled", pseudoState: "disabled" as const },
] as const

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
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    children: { description: "Dropdown structure with Trigger and Content", control: false },
  },
  args: {
    size: "md",
    pseudoState: "none",
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

// ─── Default ────────────────────────────────────────────────────────────────
/**
 * Basic dropdown with trigger and menu items.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /options/i });
    await userEvent.click(trigger);
  },
}

// ─── With Icons ──────────────────────────────────────────────────────────────
/**
 * Dropdown menu with icons for each item.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /my account/i });
    await userEvent.click(trigger);
  },
}

// ─── With Disabled Items ─────────────────────────────────────────────────────
/**
 * Dropdown with a disabled menu item.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /actions/i });
    await userEvent.click(trigger);
  },
}

// ─── Placements ───────────────────────────────────────────────────────────────
/**
 * Dropdown with bottom-end placement.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /bottom end/i });
    await userEvent.click(trigger);
  },
}

/**
 * Dropdown with top-start placement.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /top start/i });
    await userEvent.click(trigger);
  },
}

/**
 * Dropdown with top-end placement.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /top end/i });
    await userEvent.click(trigger);
  },
}

// ─── Icon-Only Trigger (Kebab Menu) ──────────────────────────────────────────
/**
 * Dropdown with icon-only (kebab) trigger.
 */
export const IconOnlyTrigger: Story = {
  name: "Icon-only trigger (kebab)",
  render: () => (
    <Dropdown>
      <Dropdown.Trigger ariaLabel="More options">
        <Ellipsis className="w-5 h-5 text-neutral-700" />
      </Dropdown.Trigger>
      <Dropdown.Content placement="bottom-end">
        <Dropdown.Item icon={<PencilIcon className="w-4 h-4 text-neutral-700" />}>Rename</Dropdown.Item>
        <Dropdown.Item icon={<Copy className="w-4 h-4 text-neutral-700" />}>Copy link</Dropdown.Item>
        <Dropdown.Item icon={<TrashIcon className="w-4 h-4 text-red-600" />} className="text-red-600 data-[focus]:bg-red-50">Delete</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /more options/i });
    await userEvent.click(trigger);
  },
}

// ─── Profile Dropdown Menu ──────────────────────────────────────────
/**
 * Profile dropdown menu with avatar trigger.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByTestId("dropdown-trigger");
    await userEvent.click(trigger);
  },
}

// ─── Long List ────────────────────────────────────────────────────────────────
/**
 * Dropdown with a long scrollable list of items.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /select country/i });
    await userEvent.click(trigger);
  },
}

// ─── With Divider ─────────────────────────────────────────────────────────────
/**
 * Dropdown menu with a divider between items.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /my account/i });
    await userEvent.click(trigger);
  },
}

// ─── Sizes ───────────────────────────────────────────────────────────────
/**
 * Dropdown in small, medium, and large sizes.
 */
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
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /small/i });
    await userEvent.click(trigger);
  },
}

/**
 * Dropdown in all pseudo states (hover, focus, disabled, etc).
 */
export const States: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: {
    size: "md",
  },
  render: (args) => (
    <div className="space-y-6 p-8">
      {stateMatrix.map((state) => (
        <div key={state.label} className="flex items-center gap-4 rounded-md border border-neutral-200 p-4">
          <p className="w-28 text-sm font-medium text-neutral-700">{state.label}</p>
          <Dropdown size={args.size} pseudoState={state.pseudoState}>
            <Dropdown.Trigger>Options</Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item>Duplicate</Dropdown.Item>
              <Dropdown.Item>Delete</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>
      ))}
    </div>
  ),
}