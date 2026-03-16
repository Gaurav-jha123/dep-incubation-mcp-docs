import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlexContainer } from "./FlexContainer";

const meta: Meta<typeof FlexContainer> = {
  title: "Layout/FlexContainer",
  component: FlexContainer,
  parameters: {
    layout: "centered",
  },
  args: {
    direction: "row",
    gap: 4, // 4 * 0.25rem = 1rem
    align: "stretch",
    justify: "start",
    wrap: "nowrap",
    fullWidth: false,
  },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["row", "col"],
      description: "Flex direction",
    },
    gap: {
      control: "text",
      description:
        "Gap between items. Number uses Tailwind spacing convention (1 = 0.25rem). String accepts any valid CSS value (e.g., '12px', '1rem').",
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
      description: "Align items (cross-axis)",
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      description: "Justify content (main-axis)",
    },
    wrap: {
      control: "select",
      options: ["wrap", "nowrap", "wrap-reverse"],
      description: "Flex wrap behavior",
    },
    fullWidth: {
      control: "boolean",
      description: "If true, container spans full width",
    },
    className: { control: false },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof FlexContainer>;

const Item = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded bg-blue-100 text-blue-900 px-3 py-2 text-center">
    {children}
  </div>
);

/**
 * Basic row layout with controls.
 */
export const Playground: Story = {
  render: (args) => (
    <FlexContainer {...args} className="p-4 bg-gray-50 rounded w-[640px]">
      <Item>Item 1</Item>
      <Item>Item 2</Item>
      <Item>Item 3</Item>
    </FlexContainer>
  ),
};

/**
 * Demonstrates row alignment across main/cross axes.
 */
export const RowAlignment: Story = {
  args: {
    direction: "row",
    justify: "between",
    align: "center",
    gap: 6,
  },
  render: (args) => (
    <FlexContainer
      {...args}
      className="p-6 bg-gray-50 rounded w-[720px] h-[160px]"
    >
      <Item>Left</Item>
      <Item>Center</Item>
      <Item>Right</Item>
    </FlexContainer>
  ),
};

/**
 * Column layout with vertical spacing (justify controls vertical alignment in column).
 */
export const ColumnCentered: Story = {
  args: {
    direction: "col",
    justify: "center",
    align: "center",
    gap: 8,
  },
  render: (args) => (
    <FlexContainer
      {...args}
      className="p-6 bg-gray-50 rounded w-[420px] h-[320px]"
    >
      <Item>A</Item>
      <Item>B</Item>
      <Item>C</Item>
    </FlexContainer>
  ),
};

/**
 * Wrapping behavior with many items.
 */
export const WrapWithManyItems: Story = {
  args: {
    direction: "row",
    wrap: "wrap",
    gap: 3,
    justify: "start",
    align: "center",
  },
  render: (args) => (
    <FlexContainer
      {...args}
      className="p-4 bg-gray-50 rounded w-[520px] border border-gray-200"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="px-3 py-2 bg-emerald-100 rounded">
          #{i + 1}
        </div>
      ))}
    </FlexContainer>
  ),
};

/**
 * Custom CSS gap value using a string (no Tailwind safelist needed).
 */
export const CustomGapString: Story = {
  args: {
    gap: "18px",
    justify: "between",
  },
  render: (args) => (
    <FlexContainer {...args} className="p-4 bg-gray-50 rounded w-[640px]">
      <Item>18px gap</Item>
      <Item>String gap</Item>
      <Item>Arbitrary CSS</Item>
    </FlexContainer>
  ),
};

/**
 * Tight spacing (number → follows Tailwind convention: 1 = 0.25rem).
 */
export const TightSpacing: Story = {
  args: {
    gap: 1, // 0.25rem
    justify: "around",
  },
  render: (args) => (
    <FlexContainer {...args} className="p-4 bg-gray-50 rounded w-[640px]">
      <Item>Compact</Item>
      <Item>Spacing</Item>
      <Item>Example</Item>
    </FlexContainer>
  ),
};