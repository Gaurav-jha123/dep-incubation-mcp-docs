import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./Table";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleData = [
  { name: "John Doe", role: "Developer", email: "john@example.com" },
  { name: "Sarah Smith", role: "Designer", email: "sarah@example.com" },
  { name: "Michael Lee", role: "Manager", email: "michael@example.com" },
  { name: "Priya Kumar", role: "QA", email: "priya@example.com" },
  { name: "David Chen", role: "Engineer", email: "david@example.com" },
  { name: "Emily Clark", role: "HR", email: "emily@example.com" },
  { name: "Raj Patel", role: "Support", email: "raj@example.com" },
  { name: "Aarav Singh", role: "Developer", email: "aarav@example.com" },
  { name: "Sophia Nguyen", role: "Designer", email: "sophia@example.com" },
];

export const Default: Story = {
  args: {
    headers: ["Name", "Role", "Email"],
    data: sampleData,
    keys: ["name", "role", "email"],
    rowsPerPageOptions: [5, 10, 20],
  },
};

export const SmallDataset: Story = {
  args: {
    headers: ["Name", "Role", "Email"],
    data: sampleData.slice(0, 3),
    keys: ["name", "role", "email"],
    rowsPerPageOptions: [2, 3, 5],
  },
};

export const LargeDataset: Story = {
  args: {
    headers: ["Name", "Role", "Email"],
    data: Array.from({ length: 50 }).map((_, i) => ({
      name: `User ${i + 1}`,
      role: i % 2 === 0 ? "Developer" : "Designer",
      email: `user${i + 1}@example.com`,
    })),
    keys: ["name", "role", "email"],
    rowsPerPageOptions: [5, 10, 20],
  },
};

export const ManyRowsPerPageOptions: Story = {
  args: {
    headers: ["Name", "Role", "Email"],
    data: sampleData,
    keys: ["name", "role", "email"],
    rowsPerPageOptions: [3, 5, 8, 10],
  },
};