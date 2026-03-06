import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
    title: 'Components/Switch',
    component: Switch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const SwitchWrapper = (args: React.ComponentProps<typeof Switch>) => {
    const [checked, setChecked] = useState(args.checked || false);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
};

export const Default: Story = {
    render: (args) => <SwitchWrapper {...args} />,
    args: {
        checked: false,
    },
};

export const Checked: Story = {
    render: (args) => <SwitchWrapper {...args} />,
    args: {
        checked: true,
    },
};

export const Disabled: Story = {
    render: (args) => <SwitchWrapper {...args} />,
    args: {
        checked: false,
        disabled: true,
    },
};

export const CheckedDisabled: Story = {
    render: (args) => <SwitchWrapper {...args} />,
    args: {
        checked: true,
        disabled: true,
    },
};
