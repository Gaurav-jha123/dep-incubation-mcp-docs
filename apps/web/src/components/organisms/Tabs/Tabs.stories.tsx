import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent } from "storybook/test";
import { Tabs } from "./Tabs";

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  { label: "Default", props: { pseudoState: "none" as const } },
  { label: "Hover", props: { pseudoState: "hover" as const } },
  { label: "Active", props: { pseudoState: "active" as const } },
  { label: "Focus", props: { pseudoState: "focus" as const } },
  {
    label: "Focus Visible",
    props: { pseudoState: "focus-visible" as const },
  },
  { label: "Disabled", props: { pseudoState: "disabled" as const } },
] as const;

const variantOptions = ["underline", "solid", "pill"] as const;

const variantLabels: Record<(typeof variantOptions)[number], string> = {
  underline: "Underline",
  solid: "Solid",
  pill: "Pill",
};

const meta: Meta<typeof Tabs> = {
  title: "Organisms/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Tabs presents related sections behind a shared navigation control with multiple visual variants and support for disabled items.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["underline", "solid", "pill"],
    },
    pseudoState: {
      control: "select",
      options: pseudoStateOptions,
      description: "Preview a forced interaction state on one tab trigger.",
    },
    pseudoStateTarget: {
      control: { type: "number", min: 0, max: 5, step: 1 },
      description:
        "Zero-based index of the tab trigger that receives the preview state.",
    },
  },
  args: {
    size: "md",
    variant: "underline",
    pseudoState: "none",
    pseudoStateTarget: 1,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
type TabsStoryArgs = React.ComponentProps<typeof Tabs>;

/**
 * Basic tabs with three sections.
 */
export const Basic: Story = {
  args: {
    tabs: [
      {
        label: "Tab One",
        content: "Content for Tab One",
      },
      {
        label: "Tab Two",
        content: "Content for Tab Two",
      },
      {
        label: "Tab Three",
        content: "Content for Tab Three",
      },
    ],
  },
  render: (args: TabsStoryArgs) => (
    <div className="w-[500px]">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const tabTwo = await canvas.findByRole("tab", { name: /tab two/i });
    await userEvent.click(tabTwo);

    const tabThree = await canvas.findByRole("tab", { name: /tab three/i });
    await userEvent.click(tabThree);
  },
};

/**
 * Tabs with a disabled tab item.
 */
export const WithDisabledTab: Story = {
  args: {
    tabs: [
      {
        label: "Profile",
        content: "Profile content",
      },
      {
        label: "Settings",
        content: "Settings content",
        disabled: true,
      },
      {
        label: "Notifications",
        content: "Notifications content",
      },
    ],
  },
  render: (args: TabsStoryArgs) => (
    <div className="w-[500px]">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const notifications = await canvas.findByRole("tab", { name: /notifications/i });
    await userEvent.click(notifications);
  },
};

/**
 * Tabs using the underline visual variant.
 */
export const UnderlineVariant: Story = {
  args: {
    variant: "underline",
    tabs: [
      {
        label: "Overview",
        content: "Overview tab content",
      },
      {
        label: "Members",
        content: "Members tab content",
      },
      {
        label: "Activity",
        content: "Activity tab content",
      },
    ],
  },
  render: (args) => (
    <div className="w-[500px]">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const membersTab = await canvas.findByRole("tab", { name: /members/i });
    await userEvent.click(membersTab);
  },
};

/**
 * Tabs using the solid visual variant.
 */
export const SolidVariant: Story = {
  args: {
    variant: "solid",
    tabs: [
      {
        label: "Overview",
        content: "Overview tab content",
      },
      {
        label: "Members",
        content: "Members tab content",
      },
      {
        label: "Activity",
        content: "Activity tab content",
      },
    ],
  },
  render: (args) => (
    <div className="w-[500px]">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const activityTab = await canvas.findByRole("tab", { name: /activity/i });
    await userEvent.click(activityTab);
  },
};

/**
 * Tabs using the pill visual variant.
 */
export const PillVariant: Story = {
  args: {
    variant: "pill",
    tabs: [
      {
        label: "Home",
        content: "Home tab content",
      },
      {
        label: "Analytics",
        content: "Analytics tab content",
      },
      {
        label: "Settings",
        content: "Settings tab content",
      },
    ],
  },
  render: (args: TabsStoryArgs) => (
    <div className="w-[500px]">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const analyticsTab = await canvas.findByRole("tab", { name: /analytics/i });
    await userEvent.click(analyticsTab);

    const settingsTab = await canvas.findByRole("tab", { name: /settings/i });
    await userEvent.click(settingsTab);
  },
};

/**
 * All tab visual variants side by side.
 */
export const AllVariants: Story = {
  args: {
    size: "md",
    pseudoState: "none",
    pseudoStateTarget: 1,
    tabs: [
      {
        label: "Overview",
        content: "Overview content",
      },
      {
        label: "Members",
        content: "Members content",
      },
      {
        label: "Activity",
        content: "Activity content",
      },
    ],
  },
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <div className="grid w-full max-w-6xl gap-4 xl:grid-cols-3">
      {variantOptions.map((variant) => (
        <div
          key={variant}
          className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm"
        >
          <p className="mb-3 text-sm font-semibold text-neutral-700">
            {variantLabels[variant]}
          </p>
          <div className="w-[420px] max-w-full">
            <Tabs {...args} variant={variant} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Preview tabs in all pseudo states (hover, focus, disabled, etc).
 */
export const PseudoStatePreview: Story = {
  args: {
    variant: "underline",
    pseudoState: "none",
    pseudoStateTarget: 1,
    tabs: [
      {
        label: "Overview",
        content: "Overview content",
      },
      {
        label: "Members",
        content: "Members content",
      },
      {
        label: "Activity",
        content: "Activity content",
      },
    ],
  },
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <div className="grid gap-4 xl:grid-cols-2">
      {stateMatrix.map(({ label, props }) => (
        <div
          key={label}
          className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm"
        >
          <p className="mb-3 text-sm font-semibold text-neutral-700">{label}</p>
          <div className="w-[420px] max-w-full">
            <Tabs {...args} {...props} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Table of all variants and pseudo states.
 */
export const VariantsAndStates: Story = {
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
                className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-700"
              >
                {variantLabels[variant]}
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
                  <div className="min-w-[420px] rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
                    <Tabs
                      size="md"
                      variant={variant}
                      pseudoStateTarget={1}
                      tabs={[
                        {
                          label: "Overview",
                          content: "Overview content",
                        },
                        {
                          label: "Members",
                          content: "Members content",
                        },
                        {
                          label: "Activity",
                          content: "Activity content",
                        },
                      ]}
                      {...props}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
