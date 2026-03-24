import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, type BadgeProps } from "./Badge";

const variantOptions = [
    "default",
    "success",
    "warning",
    "error",
    "info",
] as const;

const pseudoStateOptions = [
    "none",
    "hover",
    "active",
    "focus",
    "focus-visible",
    "disabled",
] as const;

const stateMatrix = [
    {
        label: "Default",
        text: "Default",
        props: { pseudoState: "none" as const },
    },
    {
        label: "Hover",
        text: "Hover",
        props: { pseudoState: "hover" as const },
    },
    {
        label: "Active",
        text: "Active",
        props: { pseudoState: "active" as const },
    },
    {
        label: "Focus",
        text: "Focus",
        props: { pseudoState: "focus" as const },
    },
    {
        label: "Focus Visible",
        text: "Focus",
        props: { pseudoState: "focus-visible" as const },
    },
    {
        label: "Disabled",
        text: "Disabled",
        props: { pseudoState: "disabled" as const },
    },
] as const;

const variantLabels: Record<(typeof variantOptions)[number], string> = {
    default: "Default",
    success: "Success",
    warning: "Warning",
    error: "Error",
    info: "Info",
};

const meta = {
    title: "Atoms/Badge",
    component: Badge,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: { type: "select" },
            options: variantOptions,
        },
        pseudoState: {
            control: { type: "select" },
            options: pseudoStateOptions,
        },
        text: {
            control: "text",
        },
        info: {
            control: "text",
        },
        className: {
            control: false,
        },
    },
    args: {
        text: "Badge",
        variant: "default",
        pseudoState: "none",
    },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: "Default",
    },
};

export const Success: Story = {
    args: {
        text: "Success",
        variant: "success",
    },
};

export const Warning: Story = {
    args: {
        text: "Warning",
        variant: "warning",
    },
};

export const Error: Story = {
    args: {
        text: "Error",
        variant: "error",
    },
};

export const Info: Story = {
    args: {
        text: "Info",
        variant: "info",
    },
};

export const AllVariants: Story = {
    args: {
        pseudoState: "none",
    },
    render: (args: BadgeProps) => (
        <div className="flex flex-wrap items-center gap-3">
            {variantOptions.map((variant) => (
                <Badge
                    key={variant}
                    {...args}
                    variant={variant}
                    text={variantLabels[variant]}
                />
            ))}
        </div>
    ),
};

export const InteractiveHover: Story = {
    args: {
        pseudoState: "none",
    },
    parameters: {
        layout: "padded",
    },
    render: (args: BadgeProps) => (
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm text-neutral-700">
                Move the mouse over these badges to test the real hover behavior. This
                story does not force any pseudo state.
            </p>
            <div className="flex flex-wrap items-center gap-3">
                {variantOptions.map((variant) => (
                    <Badge
                        key={variant}
                        {...args}
                        variant={variant}
                        text={variantLabels[variant]}
                    />
                ))}
            </div>
        </div>
    ),
};

export const VariantsAndStates: Story = {
    parameters: {
        layout: "fullscreen",
    },
    render: () => (
        <div className="space-y-10 p-8">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="sticky left-0 z-10 bg-white p-3 text-left text-sm font-semibold text-neutral-900">
                            State
                        </th>
                        {variantOptions.map((variant) => (
                            <th
                                key={variant}
                                className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500"
                            >
                                {variantLabels[variant]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {stateMatrix.map(({ label, text, props }) => (
                        <tr key={label} className="border-t border-dashed border-neutral-200">
                            <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium text-neutral-500">
                                {label}
                            </td>
                            {variantOptions.map((variant) => (
                                <td key={variant} className="p-3 text-center">
                                    <Badge
                                        variant={variant}
                                        text={text}
                                        {...props}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ),
};
