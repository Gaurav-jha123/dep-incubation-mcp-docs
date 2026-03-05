import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: 'Default',
    },
};

export const Success: Story = {
    args: {
        text: 'Success',
        variant: 'success',
    },
};

export const Warning: Story = {
    args: {
        text: 'Warning',
        variant: 'warning',
    },
};

export const Error: Story = {
    args: {
        text: 'Error',
        variant: 'error',
    },
};

export const Info: Story = {
    args: {
        text: 'Info',
        variant: 'info',
    },
};
