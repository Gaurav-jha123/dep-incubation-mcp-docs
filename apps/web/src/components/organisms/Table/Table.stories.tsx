import type { ComponentProps } from "react";
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

type EmployeeRow = {
  name: string;
  role: string;
  email: string;
};

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

const headers: Array<keyof EmployeeRow extends string ? string : never> = ["Name", "Role", "Email"];
const keys: Array<keyof EmployeeRow> = ["name", "role", "email"];

const stateMatrix: Array<{
  label: string;
  description: string;
  args: ComponentProps<typeof Table<EmployeeRow>>;
}> = [
  {
    label: "Default",
    description: "Standard table with search and pagination controls visible.",
    args: {
      headers,
      data: sampleData,
      keys,
      rowsPerPageOptions: [5, 10, 20],
    },
  },
  {
    label: "Empty",
    description: "No rows available, showing the empty-state message.",
    args: {
      headers,
      data: [],
      keys,
      rowsPerPageOptions: [5, 10, 20],
    },
  },
  {
    label: "Single page",
    description: "Small dataset with no extra pagination beyond one page.",
    args: {
      headers,
      data: sampleData.slice(0, 3),
      keys,
      rowsPerPageOptions: [5],
    },
  },
  {
    label: "Sticky columns",
    description: "Sticky header and first column for longer tables.",
    args: {
      headers,
      data: sampleData,
      keys,
      rowsPerPageOptions: [5, 10, 20],
      stickyHeader: true,
      stickyFirstColumn: true,
    },
  },
  {
    label: "Controls hidden",
    description: "Search disabled and rows-per-page selector removed.",
    args: {
      headers,
      data: sampleData.slice(0, 5),
      keys,
      showSearch: false,
      rowsPerPageOptions: [5],
    },
  },
];

/**
 * Default table with sample data and pagination.
 */
export const Default: Story = {
  args: {
    headers,
    data: sampleData,
    keys,
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

/**
 * Table with a small dataset (3 rows).
 */
export const SmallDataset: Story = {
  args: {
    headers,
    data: sampleData.slice(0, 3),
    keys,
    rowsPerPageOptions: [2, 3, 5],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await userEvent.click(canvas.getByRole("button", { name: "Previous" }));
  },
};

/**
 * Table with a large dataset (50 rows).
 */
export const LargeDataset: Story = {
  args: {
    headers,
    data: Array.from({ length: 50 }).map((_, i) => ({
      name: `User ${i + 1}`,
      role: i % 2 === 0 ? "Developer" : "Designer",
      email: `user${i + 1}@example.com`,
    })),
    keys,
    rowsPerPageOptions: [5, 10, 20],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText("Role"));
    await userEvent.click(canvas.getByText("Role"));
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
  },
};

/**
 * Table with multiple rows-per-page options.
 */
export const ManyRowsPerPageOptions: Story = {
  args: {
    headers,
    data: sampleData,
    keys,
    rowsPerPageOptions: [3, 5, 8, 10],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Rows: 3" }));
    await userEvent.click(canvas.getByRole("option", { name: "10" }));
  },
};

export const States: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="space-y-6 p-6">
      {stateMatrix.map((state) => (
        <section
          key={state.label}
          className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
              {state.label}
            </h3>
            <p className="text-sm text-neutral-600">{state.description}</p>
          </div>
          <Table {...state.args} />
        </section>
      ))}
    </div>
  ),
};
