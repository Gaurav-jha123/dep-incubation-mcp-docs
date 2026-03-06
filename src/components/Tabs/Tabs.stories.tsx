import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from "./Tabs";

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
    defaultValue: {
      control: "text",
    },
  },
  args: {
    size: "md",
    variant: "underline",
    defaultValue: "tab1",
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Basic: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[500px]">
      <TabList>
        <Tab value="tab1">Tab One</Tab>
        <Tab value="tab2">Tab Two</Tab>
        <Tab value="tab3">Tab Three</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="tab1">Content for Tab One</TabPanel>
        <TabPanel value="tab2">Content for Tab Two</TabPanel>
        <TabPanel value="tab3">Content for Tab Three</TabPanel>
      </TabPanels>
    </Tabs>
  ),
};