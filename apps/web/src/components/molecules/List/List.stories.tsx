import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Settings, User } from "lucide-react";
import { useState } from "react";
import { List, type ListItem, type ListProps } from "./List";

const variantOptions = ["default", "bordered", "card"] as const;

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const variantLabels: Record<(typeof variantOptions)[number], string> = {
  default: "Default",
  bordered: "Bordered",
  card: "Card",
};

const baseItems: ListItem[] = [
  {
    icon: <User className="h-4 w-4" />,
    label: "Profile",
    description: "Manage your personal information",
  },
  {
    icon: <Bell className="h-4 w-4" />,
    label: "Messages",
    description: "View new notifications",
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
    description: "Configure your preferences",
  },
];

const stateMatrix = [
  {
    label: "Default",
    getProps: (): Partial<ListProps> => ({
      value: baseItems[0],
    }),
  },
  {
    label: "Hover",
    getProps: (): Partial<ListProps> => ({
      value: baseItems[0],
      pseudoState: "hover",
      pseudoStateTarget: 1,
    }),
  },
  {
    label: "Active",
    getProps: (): Partial<ListProps> => ({
      value: baseItems[0],
      pseudoState: "active",
      pseudoStateTarget: 1,
    }),
  },
  {
    label: "Focus",
    getProps: (): Partial<ListProps> => ({
      value: baseItems[0],
      pseudoState: "focus",
      pseudoStateTarget: 1,
    }),
  },
  {
    label: "Focus Visible",
    getProps: (): Partial<ListProps> => ({
      value: baseItems[0],
      pseudoState: "focus-visible",
      pseudoStateTarget: 1,
    }),
  },
  {
    label: "Selected",
    getProps: (): Partial<ListProps> => ({
      value: baseItems[1],
    }),
  },
  {
    label: "Disabled",
    getProps: (): Partial<ListProps> => ({
      value: baseItems[0],
      pseudoState: "disabled",
      pseudoStateTarget: 1,
    }),
  },
] as const;

const meta: Meta<typeof List> = {
  title: "Molecules/List",
  component: List,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    variant: "default",
    items: baseItems,
    pseudoState: "none",
    pseudoStateTarget: 1,
    ariaLabel: "Selectable items",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: variantOptions,
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    pseudoStateTarget: {
      control: { type: "number", min: 0, max: 2, step: 1 },
    },
    onChange: { table: { disable: true } },
    value: { table: { disable: true } },
    items: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderSelectableList(args: ListProps, storyArgs?: Partial<ListProps>) {
  const [selected, setSelected] = useState<ListItem>(baseItems[0]);

  return (
    <div className="w-80">
      <List
        {...args}
        {...storyArgs}
        items={baseItems}
        value={selected}
        onChange={setSelected}
      />
    </div>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default selectable list with icons and descriptions."
      }
    }
  },
  render: (args) => renderSelectableList(args),
};

export const Bordered: Story = {
  parameters: {
    docs: {
      description: {
        story: "List with bordered variant."
      }
    }
  },
  args: {
    variant: "bordered",
  },
  render: (args) => renderSelectableList(args),
};

export const CardVariant: Story = {
  name: "Card",
  parameters: {
    docs: {
      description: {
        story: "List with card variant."
      }
    }
  },
  args: {
    variant: "card",
  },
  render: (args) => renderSelectableList(args),
};

export const AllVariants: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Grid of all list variants."
      }
    }
  },
  args: {
    pseudoState: "none",
    pseudoStateTarget: 1,
  },
  render: (args: ListProps) => {
    const [selected, setSelected] = useState<ListItem>(baseItems[0]);

    return (
      <div className="grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        {variantOptions.map((variant) => (
          <div
            key={variant}
            className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm"
          >
            <p className="mb-3 text-sm font-semibold text-neutral-700">
              {variantLabels[variant]}
            </p>
            <List
              {...args}
              variant={variant}
              items={baseItems}
              value={selected}
              onChange={setSelected}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const PseudoStatePreview: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Preview of all pseudo states for the list."
      }
    }
  },
  args: {
    variant: "bordered",
    pseudoState: "none",
    pseudoStateTarget: 1,
  },
  render: (args: ListProps) => (
    <div className="grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stateMatrix.map(({ label, getProps }) => (
        <div
          key={label}
          className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm"
        >
          <p className="mb-3 text-sm font-semibold text-neutral-700">{label}</p>
          <div className="w-80 max-w-full">
            <List
              {...args}
              items={baseItems}
              onChange={() => undefined}
              {...getProps()}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const VariantsAndStates: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Table of all list variants and pseudo states."
      }
    }
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
          {stateMatrix.map(({ label, getProps }) => (
            <tr
              key={label}
              className="border-t border-dashed border-neutral-200"
            >
              <td className="sticky left-0 z-10 bg-neutral-50 p-3 align-top text-sm font-medium text-neutral-700">
                {label}
              </td>
              {variantOptions.map((variant) => (
                <td key={`${label}-${variant}`} className="p-3 align-top">
                  <div className="min-w-[280px] rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
                    <List
                      variant={variant}
                      items={baseItems}
                      onChange={() => undefined}
                      {...getProps()}
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
