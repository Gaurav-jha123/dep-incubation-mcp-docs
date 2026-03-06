import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropdown } from "./Dropdown"
import { 
    ArrowRight,
    ChevronDownIcon,
    CogIcon,
    Copy,
    Ellipsis,
    Headset,
    PencilIcon,
    Settings,
    SquareArrowRight,
    SquareUser,
    TrashIcon,
    UserIcon
} from "lucide-react";
import { Avatar } from "../Avatar/Avatar";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A composable dropdown menu using Trigger, Content, Item and Divider.",
      },
    },
  },

  argTypes: {
    className: {
      description: "Extra Tailwind or CSS classes",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },

    children: {
      description: "Dropdown structure with Trigger and Content",
      control: false,
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
};

export default meta
type Story = StoryObj<typeof Dropdown>

// ─── Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger className="bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 gap-2">
        Options
        <ChevronDownIcon className="w-4 h-4" />
      </Dropdown.Trigger>
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
      <Dropdown.Trigger className="bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 gap-2">
        My Account
        <ChevronDownIcon className="w-4 h-4" />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={() => {}}>
          <span className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-gray-500" />
            Profile
          </span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => {}}>
          <span className="flex items-center gap-2">
            <CogIcon className="w-4 h-4 text-gray-500" />
            Settings
          </span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => {}}>
          <span className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-500" />
            Sign out
          </span>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── With Disabled Items ─────────────────────────────────────────────────────

export const WithDisabledItems: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger className="bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 gap-2">
        Actions
        <ChevronDownIcon className="w-4 h-4" />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={() => {}}>
          <span className="flex items-center gap-2">
            Edit
          </span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => {}}>
          <span className="flex items-center gap-2">
            Duplicate
          </span>
        </Dropdown.Item>
        <Dropdown.Item disabled onClick={() => {}}>
          <span className="flex items-center gap-2">
            Delete (no permission)
          </span>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── Placements ───────────────────────────────────────────────────────────────

export const PlacementBottomEnd: Story = {
  name: "Placement: bottom-end",
  render: () => (
    <Dropdown>
      <Dropdown.Trigger className="bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 gap-2">
        Bottom End
        <ChevronDownIcon className="w-4 h-4" />
      </Dropdown.Trigger>
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
  decorators: [
    (Story) => (
      <div className="flex items-end justify-center h-48">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Dropdown>
      <Dropdown.Trigger className="bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 gap-2">
        Top Start
        <ChevronDownIcon className="w-4 h-4" />
      </Dropdown.Trigger>
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
  decorators: [
    (Story) => (
      <div className="flex items-end justify-center h-48">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Dropdown>
      <Dropdown.Trigger className="bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 gap-2">
        Top End
        <ChevronDownIcon className="w-4 h-4" />
      </Dropdown.Trigger>
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
      <Dropdown.Trigger className="text-gray-500 hover:bg-gray-100 px-2">
        <Ellipsis className="w-5 h-5" />
      </Dropdown.Trigger>
      <Dropdown.Content placement="bottom-end">
        <Dropdown.Item onClick={() => {}}>
          <span className="flex items-center gap-2">
            <PencilIcon className="w-4 h-4 text-gray-500" />
            Rename
          </span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => {}}>
          <span className="flex items-center gap-2">
            <Copy className="w-4 h-4 text-gray-500" />
            Copy link
          </span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {}}
          className="text-red-600 data-[focus]:bg-red-50"
        >
          <span className="flex items-center gap-2">
            <TrashIcon className="w-4 h-4" />
            Delete
          </span>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── Profile Dropdown Menu ──────────────────────────────────────────

export const ProfileDropdownMenu: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger className="text-gray-500 hover:bg-gray-100 px-2">
        <Avatar src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/ct-assets/team-4.jpg" className="w-5 h-5" />
      </Dropdown.Trigger>
      <Dropdown.Content placement="bottom-end">
        <Dropdown.Item onClick={() => {}}>
          <span className="flex items-center gap-2">
            <SquareUser className="w-4 h-4 text-gray-500" />
            My Profile
          </span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => {}}>
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            Edit Profile
          </span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {}}
          className="text-red-600 data-[focus]:bg-red-50"
        >
          <span className="flex items-center gap-2">
            <Headset className="w-4 h-4" />
            Support
          </span>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item >
            <span className="flex items-center gap-2">
                <SquareArrowRight className="w-4 h-4" />
                Sign out
          </span>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── Styled Trigger ───────────────────────────────────────────────────────────

export const PrimaryTrigger: Story = {
  name: "Primary styled trigger",
  render: () => (
    <Dropdown>
      <Dropdown.Trigger className="bg-blue-600 text-white hover:bg-blue-700 shadow gap-2">
        New
        <ChevronDownIcon className="w-4 h-4" />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={() => {}}>New file</Dropdown.Item>
        <Dropdown.Item onClick={() => {}}>New folder</Dropdown.Item>
        <Dropdown.Item onClick={() => {}}>Upload</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── Long List ────────────────────────────────────────────────────────────────

export const LongList: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger className="bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 gap-2">
        Select country
        <ChevronDownIcon className="w-4 h-4" />
      </Dropdown.Trigger>
      <Dropdown.Content className="max-h-56 overflow-y-auto">
        {[
          "Australia",
          "Brazil",
          "Canada",
          "Denmark",
          "Egypt",
          "Finland",
          "Germany",
          "Hungary",
          "India",
          "Japan",
          "Kenya",
          "Luxembourg",
        ].map((country) => (
          <Dropdown.Item key={country} onClick={() => {}}>
            {country}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  ),
}

// ─── With Divider ─────────────────────────────────────────────────────────────

export const WithDivider: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger className="bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 gap-2">
        My Account
        <ChevronDownIcon className="w-4 h-4" />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item >Profile</Dropdown.Item>
        <Dropdown.Item >Settings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item >Sign out</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}