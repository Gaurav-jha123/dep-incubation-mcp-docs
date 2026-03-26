import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { List, type ListItem } from "./List";

const meta: Meta<typeof List> = {
  title: "Molecules/List",
  component: List,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "card"],
    },
    onChange: { table: { disable: true } },
    value: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
type ListStoryArgs = React.ComponentProps<typeof List>;

const items: ListItem[] = [
  {
    label: "Profile",
    description: "Manage your personal information",
  },
  {
    label: "Messages",
    description: "View new notifications",
  },
  {
    label: "Settings",
    description: "Configure your preferences",
  },
];

export const Default: Story = {
  render: (args: ListStoryArgs) => {
    const [selected, setSelected] = useState<ListItem>(items[0]);

    return (
      <div className="w-80">
        <List
          {...args}
          items={items}
          value={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
};

export const Bordered: Story = {
  render: () => {
    const [selected, setSelected] = useState<ListItem>(items[0]);

    return (
      <div className="w-80">
        <List
          variant="bordered"
          items={items}
          value={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
};

export const Card: Story = {
  render: () => {
    const [selected, setSelected] = useState<ListItem>(items[0]);

    return (
      <div className="w-80">
        <List
          variant="card"
          items={items}
          value={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
};