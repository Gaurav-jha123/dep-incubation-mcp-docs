import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
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
  },
  args: {
    size: "md",
    variant: "underline",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

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
  render: (args) => (
    <div className="w-[500px]">
      <Tabs {...args} />
    </div>
  ),
};

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
  render: (args) => (
    <div className="w-[500px]">
      <Tabs {...args} />
    </div>
  ),
};

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
  render: (args) => (
    <div className="w-[500px]">
      <Tabs {...args} />
    </div>
  ),
};