import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Switch, type SwitchPseudoState } from './Switch';

type SwitchStoryProps = ComponentProps<typeof Switch>;

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  { label: "Default", pseudoState: "none" as const },
  { label: "Hover", pseudoState: "hover" as const },
  { label: "Active", pseudoState: "active" as const },
  { label: "Focus", pseudoState: "focus" as const },
  { label: "Focus Visible", pseudoState: "focus-visible" as const },
  { label: "Disabled", pseudoState: "disabled" as const },
];

const meta: Meta<typeof Switch> = {
    title: "Atoms/Switch",
    component: Switch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        pseudoState: {
            control: { type: 'select' },
            options: pseudoStateOptions,
        },
        label: {
            control: 'text',
        },
        checked: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
    },
    args: {
        pseudoState: 'none',
        checked: false,
        disabled: false,
        label: 'toggle switch',
        onChange: fn(),
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

const SwitchWrapper = (args: SwitchStoryProps) => {
    const [checked, setChecked] = useState(args.checked || false);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
};

export const Default: Story = {
    render: (args: SwitchStoryProps) => <SwitchWrapper {...args} />,
    args: {
        checked: false,
    },
};

export const Checked: Story = {
    render: (args: SwitchStoryProps) => <SwitchWrapper {...args} />,
    args: {
        checked: true,
    },
};

export const Disabled: Story = {
    render: (args: SwitchStoryProps) => <SwitchWrapper {...args} />,
    args: {
        checked: false,
        disabled: true,
    },
};

export const CheckedDisabled: Story = {
    render: (args: SwitchStoryProps) => <SwitchWrapper {...args} />,
    args: {
        checked: true,
        disabled: true,
    },
};

export const Interactive: Story = {
    parameters: {
        layout: 'padded',
    },
    render: (args: SwitchStoryProps) => (
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm text-neutral-700">
                Toggle this switch to test real interaction behavior. This story does not force any pseudo state.
            </p>
            <SwitchWrapper {...args} pseudoState="none" />
        </div>
    ),
    args: {
        checked: false,
        disabled: false,
    },
};

export const States: Story = {
    parameters: {
        layout: 'padded',
    },
    render: (args: SwitchStoryProps) => (
        <div className="space-y-6">
            <div className="space-y-4">
                <p className="text-lg font-semibold text-neutral-900">Unchecked States</p>
                <div className="space-y-3">
                    {stateMatrix.map((state) => (
                        <div key={`unchecked-${state.label}`} className="flex items-center gap-4">
                            <p className="w-24 text-sm font-medium text-neutral-700">{state.label}</p>
                            <SwitchWrapper
                                {...args}
                                checked={false}
                                pseudoState={state.pseudoState as SwitchPseudoState}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-lg font-semibold text-neutral-900">Checked States</p>
                <div className="space-y-3">
                    {stateMatrix.map((state) => (
                        <div key={`checked-${state.label}`} className="flex items-center gap-4">
                            <p className="w-24 text-sm font-medium text-neutral-700">{state.label}</p>
                            <SwitchWrapper
                                {...args}
                                checked={true}
                                pseudoState={state.pseudoState as SwitchPseudoState}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ),
    args: {
        disabled: false,
    },
};

export const VariantsAndStates: Story = {
    parameters: {
        layout: 'fullscreen',
    },
    render: (args: SwitchStoryProps) => (
        <div className="space-y-10 p-8">
            <table className="w-full max-w-2xl border-collapse">
                <thead>
                    <tr>
                        <th className="sticky left-0 z-10 bg-white p-3 text-left text-sm font-semibold text-neutral-900">
                            State
                        </th>
                        <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Unchecked
                        </th>
                        <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Checked
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {stateMatrix.map((state) => (
                        <tr
                            key={state.label}
                            className="border-t border-dashed border-neutral-200"
                        >
                            <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium text-neutral-500">
                                {state.label}
                            </td>
                            <td className="p-3 text-center">
                                <Switch
                                    {...args}
                                    checked={false}
                                    onChange={fn()}
                                    pseudoState={state.pseudoState as SwitchPseudoState}
                                />
                            </td>
                            <td className="p-3 text-center">
                                <Switch
                                    {...args}
                                    checked
                                    onChange={fn()}
                                    pseudoState={state.pseudoState as SwitchPseudoState}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ),
    args: {
        disabled: false,
        label: 'toggle switch',
    },
};
