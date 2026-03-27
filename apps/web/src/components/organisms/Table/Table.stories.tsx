import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "@storybook/testing-library";
import { Table } from "./Table";

const meta: Meta<typeof Table> = {
  title: "Organisms/Table",
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByPlaceholderText("Search..."), "designer");
    await userEvent.clear(canvas.getByPlaceholderText("Search..."));

    await userEvent.click(canvas.getByText("Name"));
    await userEvent.click(canvas.getByText("Name"));
  },
};

export const SmallDataset: Story = {
  args: {
    headers: ["Name", "Role", "Email"],
    data: sampleData.slice(0, 3),
    keys: ["name", "role", "email"],
    rowsPerPageOptions: [2, 3, 5],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await userEvent.click(canvas.getByRole("button", { name: "Previous" }));
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText("Role"));
    await userEvent.click(canvas.getByText("Role"));
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
  },
};

export const ManyRowsPerPageOptions: Story = {
  args: {
    headers: ["Name", "Role", "Email"],
    data: sampleData,
    keys: ["name", "role", "email"],
    rowsPerPageOptions: [3, 5, 8, 10],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Rows: 3" }));
    await userEvent.click(canvas.getByRole("option", { name: "10" }));
  },
};