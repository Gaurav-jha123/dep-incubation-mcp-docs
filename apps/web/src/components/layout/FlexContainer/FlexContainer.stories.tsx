import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlexContainer } from "./FlexContainer";

const variantOptions = [
  "default",
  "surface",
  "muted",
  "outline",
  "elevated",
] as const;

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  { label: "Default", props: { pseudoState: "none" as const } },
  { label: "Hover", props: { pseudoState: "hover" as const } },
  { label: "Active", props: { pseudoState: "active" as const } },
  {
    label: "Focus Visible",
    props: { pseudoState: "focus-visible" as const },
  },
  { label: "Disabled", props: { pseudoState: "disabled" as const } },
] as const;

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
    variant: "default",
    pseudoState: "none",
  },
  argTypes: {
    variant: {
      control: "select",
      options: variantOptions,
      description: "Decorative container styling variant",
    },
    pseudoState: {
      control: "select",
      options: pseudoStateOptions,
      description: "Preview pseudo state for design review",
    },
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
  <div className="rounded bg-primary-200 px-3 py-2 text-center text-primary-900">
    {children}
  </div>
);

/**
 * Basic row layout with controls.
 */
export const Playground: Story = {
  args: {
    gap: "",
  },

  render: (args) => (
    <FlexContainer {...args} className="w-[640px] rounded bg-neutral-50 p-4">
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
      className="h-[160px] w-[720px] rounded bg-neutral-50 p-6"
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
      className="h-[320px] w-[420px] rounded bg-neutral-50 p-6"
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
      className="w-[520px] rounded border border-neutral-200 bg-neutral-50 p-4"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="rounded bg-success-200 px-3 py-2 text-success-900"
        >
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
    <FlexContainer {...args} className="w-[640px] rounded bg-neutral-50 p-4">
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
    <FlexContainer {...args} className="w-[640px] rounded bg-neutral-50 p-4">
      <Item>Compact</Item>
      <Item>Spacing</Item>
      <Item>Example</Item>
    </FlexContainer>
  ),
};

export const DecorativeVariants: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="grid gap-4 p-8 md:grid-cols-2 xl:grid-cols-5">
      {variantOptions.map((variant) => (
        <FlexContainer
          key={variant}
          variant={variant}
          direction="col"
          gap={3}
          className="min-h-40 p-5"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
            {variant}
          </div>
          <div className="text-lg font-semibold text-neutral-900">
            Flex layout card
          </div>
          <div className="text-sm text-neutral-700">
            Decorative variants are useful when the layout wrapper also owns a
            surface treatment.
          </div>
        </FlexContainer>
      ))}
    </div>
  ),
};

export const PseudoStatePreview: Story = {
  render: (args) => (
    <FlexContainer
      {...args}
      variant="outline"
      gap={4}
      className="w-[720px] p-6"
    >
      <Item>Filter</Item>
      <Item>Sort</Item>
      <Item>Export</Item>
    </FlexContainer>
  ),
};

export const VariantsAndStates: Story = {
  args: {
    direction: "col",
  },

  parameters: {
    layout: "fullscreen",
  },

  render: () => (
    <div className="space-y-8 p-8">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-neutral-50 p-3 text-left text-sm font-semibold text-neutral-900">
              State
            </th>
            {variantOptions.map((variant) => (
              <th
                key={variant}
                className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-700"
              >
                {variant}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stateMatrix.map(({ label, props }) => (
            <tr
              key={label}
              className="border-t border-dashed border-neutral-200"
            >
              <td className="sticky left-0 z-10 bg-neutral-50 p-3 align-top text-sm font-medium text-neutral-700">
                {label}
              </td>
              {variantOptions.map((variant) => (
                <td key={`${label}-${variant}`} className="p-3 align-top">
                  <FlexContainer
                    variant={variant}
                    pseudoState={props.pseudoState}
                    direction="col"
                    gap={3}
                    className="min-h-36 p-4"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                      {variant}
                    </div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {label} preview
                    </div>
                    <div className="text-sm text-neutral-900">
                      Layout wrapper with decorative state treatment.
                    </div>
                  </FlexContainer>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
