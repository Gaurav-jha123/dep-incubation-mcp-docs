import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlexContainer } from "./FlexContainer";

const meta: Meta<typeof FlexContainer> = {
  title: "Components/FlexContainer",
  component: FlexContainer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Row: Story = {
  args: {
    direction: "row",
    gap: 4,
    children: (
      <>
        <div className="p-4 bg-blue-100 rounded">Item 1</div>
        <div className="p-4 bg-blue-100 rounded">Item 2</div>
        <div className="p-4 bg-blue-100 rounded">Item 3</div>
      </>
    ),
  },
};

export const Column: Story = {
  args: {
    direction: "col",
    gap: 4,
    children: (
      <>
        <div className="p-4 bg-green-100 rounded">Item 1</div>
        <div className="p-4 bg-green-100 rounded">Item 2</div>
        <div className="p-4 bg-green-100 rounded">Item 3</div>
      </>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    direction: "row",
    fullWidth: true,
    justify: "between",
    children: (
      <>
        <div className="p-4 bg-purple-100 rounded">Left</div>
        <div className="p-4 bg-purple-100 rounded">Right</div>
      </>
    ),
  },
};