import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, type AvatarProps } from "./Avatar";

const sizeOptions = ["sm", "md", "lg", "xl"] as const;

const statusOptions = ["online", "offline", "busy", "away"] as const;

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  {
    label: "Default",
    props: { pseudoState: "none" as const },
  },
  {
    label: "Hover",
    props: { pseudoState: "hover" as const },
  },
  {
    label: "Active",
    props: { pseudoState: "active" as const },
  },
  {
    label: "Focus",
    props: { pseudoState: "focus" as const },
  },
  {
    label: "Focus Visible",
    props: { pseudoState: "focus-visible" as const },
  },
  {
    label: "Disabled",
    props: { pseudoState: "disabled" as const },
  },
] as const;

const previewAvatarArgs = {
  src: "https://via.placeholder.com/150",
  alt: "KR",
};

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: {
      control: { type: "select" },
      options: sizeOptions,
    },
    status: {
      control: { type: "select" },
      options: statusOptions,
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    src: {
      control: "text",
    },
    alt: {
      control: "text",
    },
    className: {
      control: false,
    },
  },
  args: {
    size: "md",
    pseudoState: "none",
    alt: "KR",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  parameters: {
    docs: {
      description: {
        story: "A basic avatar with a placeholder image and initials. Use for default or missing user images."
      }
    }
  },
  args: {
    src: "/missing-avatar.png",
    alt: "KR",
  },
};

export const Status: Story = {
  parameters: {
    docs: {
      description: {
        story: "Showcases avatar with an online status indicator. Useful for presence or activity states."
      }
    }
  },
  args: {
    ...previewAvatarArgs,
    status: "online",
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "Displays all avatar size options for visual comparison."
      }
    }
  },
  args: {
    pseudoState: "none",
  },
  render: (args: AvatarProps) => (
    <div className="flex gap-4">
      {sizeOptions.map((size) => (
        <Avatar key={size} {...args} alt="A" size={size} />
      ))}
    </div>
  ),
};

export const AllStatuses: Story = {
  parameters: {
    docs: {
      description: {
        story: "Demonstrates all status variants for the avatar component."
      }
    }
  },
  args: {
    ...previewAvatarArgs,
    pseudoState: "none",
  },
  render: (args: AvatarProps) => (
    <div className="flex flex-wrap gap-4">
      {statusOptions.map((status) => (
        <Avatar key={status} {...args} status={status} />
      ))}
    </div>
  ),
};

export const InteractiveHover: Story = {
  parameters: {
    docs: {
      description: {
        story: "Test real hover behavior on avatars. No pseudo state is forced."
      }
    },
    layout: "padded",
  },
  args: {
    ...previewAvatarArgs,
    pseudoState: "none",
  },
  render: (args: AvatarProps) => (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
      <p className="text-sm text-neutral-700">
        Move the mouse over these avatars to test the real hover behavior. This
        story does not force any pseudo state.
      </p>
      <div className="flex flex-wrap gap-4">
        {sizeOptions.map((size) => (
          <Avatar key={size} {...args} size={size} />
        ))}
      </div>
    </div>
  ),
};

const sizeLabels: Record<(typeof sizeOptions)[number], string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
  xl: "Extra Large",
};

export const SizesAndStates: Story = {
  parameters: {
    docs: {
      description: {
        story: "Matrix of all avatar sizes and pseudo states for comprehensive visual testing."
      }
    },
    layout: "fullscreen",
  },
  render: () => (
    <div className="space-y-10 p-8">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white p-3 text-left text-sm font-semibold text-neutral-900">
              State
            </th>
            {sizeOptions.map((size) => (
              <th
                key={size}
                className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-700"
              >
                {sizeLabels[size]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stateMatrix.map(({ label, props }) => (
            <tr key={label} className="border-t border-dashed border-neutral-200">
              <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium text-neutral-700">
                {label}
              </td>
              {sizeOptions.map((size) => (
                <td key={size} className="p-3 text-center">
                  <Avatar
                    {...previewAvatarArgs}
                    size={size}
                    status="online"
                    {...props}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};