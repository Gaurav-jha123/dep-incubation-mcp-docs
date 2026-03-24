import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/atoms";

import { Tooltip, type TooltipProps } from "./Tooltip";

const variantOptions = ["default", "subtle"] as const;
const sizeOptions = ["sm", "md", "lg"] as const;
const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const meta: Meta<typeof Tooltip> = {
  title: "Molecules/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: variantOptions,
    },
    size: {
      control: "select",
      options: sizeOptions,
    },
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
    pseudoState: {
      control: "select",
      options: pseudoStateOptions,
      description: "Preview interaction states without hovering",
    },
  },
  args: {
    content: "Tooltip message",
    placement: "top",
    disabled: false,
    variant: "default",
    size: "md",
    pseudoState: "none",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args: TooltipProps) => (
    <Tooltip {...args}>
      <Button variant="primary">Hover me</Button>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <Tooltip content="Top tooltip" placement="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>

      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>

      <Tooltip content="Left tooltip" placement="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>

      <Tooltip content="Right tooltip" placement="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tooltip content="You should not see this" disabled>
      <Button variant="secondary" disabled>
        Disabled tooltip
      </Button>
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

export const States: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: (args: TooltipProps) => (
    <div className="grid gap-4 bg-neutral-50 p-8 md:grid-cols-2">
      {pseudoStateOptions.map((pseudoState) => (
        <div
          key={pseudoState}
          className="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium capitalize text-neutral-700">
            {pseudoState}
          </p>
          <Tooltip
            {...args}
            pseudoState={pseudoState}
            content={`Tooltip in ${pseudoState} state`}
          >
            <Button variant="outline">Preview tooltip</Button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};