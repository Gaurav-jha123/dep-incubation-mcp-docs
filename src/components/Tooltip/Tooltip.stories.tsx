import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Preferred placement of the tooltip relative to the trigger",
    },
    content: {
      control: "text",
      description: "Content to render inside the tooltip",
    },
    offset: {
      control: { type: "number", min: 0, step: 1 },
      description: "Gap (px) between trigger and tooltip",
    },
    disabled: {
      control: "boolean",
      description: "Disable tooltip behavior",
    },
    className: { control: false },
    // From HTMLAttributes<HTMLDivElement> — typically not needed in controls
    onMouseEnter: { table: { disable: true } },
    onMouseLeave: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    role: { table: { disable: true } },
    id: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: {
    content: "Tooltip message",
    placement: "top",
    offset: 8,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  name: "Basic",
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">
        Hover or focus me
      </button>
    </Tooltip>
  ),
};

export const Placements: Story = {
  name: "All Placements",
  render: () => (
    <div className="flex gap-6 flex-wrap">
      <Tooltip content="Top" placement="top">
        <button className="px-3 py-2 bg-gray-200 rounded">Top</button>
      </Tooltip>
      <Tooltip content="Bottom" placement="bottom">
        <button className="px-3 py-2 bg-gray-200 rounded">Bottom</button>
      </Tooltip>
      <Tooltip content="Left" placement="left">
        <button className="px-3 py-2 bg-gray-200 rounded">Left</button>
      </Tooltip>
      <Tooltip content="Right" placement="right">
        <button className="px-3 py-2 bg-gray-200 rounded">Right</button>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <Tooltip content="You should not see this" disabled>
      <button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
        Disabled tooltip
      </button>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  name: "Long Content",
  render: () => (
    <Tooltip
      placement="bottom"
      content={
        <div className="max-w-xs">
          <strong className="block mb-1">Heads up!</strong>
          This is a longer tooltip with more descriptive text to show wrapping
          and max width behavior. You can render any ReactNode here.
        </div>
      }
    >
      <span className="underline decoration-dotted cursor-help">
        Hover me for a long tooltip
      </span>
    </Tooltip>
  ),
};

