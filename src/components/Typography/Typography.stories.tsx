import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
    title: 'Components/Typography',
    component: Typography,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
    args: {
        variant: 'h1',
        children: 'Heading 1',
    },
};

export const Heading2: Story = {
    args: {
        variant: 'h2',
        children: 'Heading 2',
    },
};

export const Heading3: Story = {
    args: {
        variant: 'h3',
        children: 'Heading 3',
    },
};

export const Heading4: Story = {
    args: {
        variant: 'h4',
        children: 'Heading 4',
    },
};

export const Body: Story = {
    args: {
        variant: 'body',
        children: 'This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
};

export const Caption: Story = {
    args: {
        variant: 'caption',
        children: 'This is caption text',
    },
};

export const CollapsibleHeading: Story = {
    args: {
        variant: 'h3',
        children: 'Click to expand',
        collapsible: true,
    },
};
