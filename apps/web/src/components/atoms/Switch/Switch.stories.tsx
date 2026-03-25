import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch, type SwitchPseudoState } from './Switch';

type SwitchStoryProps = React.ComponentProps<typeof Switch>;

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
