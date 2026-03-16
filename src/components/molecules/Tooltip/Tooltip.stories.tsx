import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Molecules/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Placement of the tooltip",
    },
    content: {
      control: "text",
      description: "Tooltip content",
    },
    disabled: {
      control: "boolean",
      description: "Disable tooltip behavior",
    },
  },
  args: {
    content: "Tooltip message",
    placement: "top",
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-primary-700 text-primary-50 rounded">
        Hover me
      </button>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex gap-6 flex-wrap">
      <Tooltip content="Top tooltip" placement="top">
        <button className="px-3 py-2 bg-primary-200 rounded">Top</button>
      </Tooltip>

      <Tooltip content="Bottom tooltip" placement="bottom">
        <button className="px-3 py-2 bg-primary-200 rounded">Bottom</button>
      </Tooltip>

      <Tooltip content="Left tooltip" placement="left">
        <button className="px-3 py-2 bg-primary-200 rounded">Left</button>
      </Tooltip>

      <Tooltip content="Right tooltip" placement="right">
        <button className="px-3 py-2 bg-primary-200 rounded">Right</button>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tooltip content="You should not see this" disabled>
      <button className="px-4 py-2 bg-primary-200 text-primary-900 rounded cursor-not-allowed">
        Disabled tooltip
      </button>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip
      placement="bottom"
      content={
        <div className="max-w-xs">
          <strong className="block mb-1">Heads up!</strong>
          This is a longer tooltip with more descriptive text to demonstrate
          wrapping and max width behavior.
        </div>
      }
    >
      <span className="underline decoration-dotted cursor-help">
        Hover me for a long tooltip
      </span>
    </Tooltip>
  ),
};