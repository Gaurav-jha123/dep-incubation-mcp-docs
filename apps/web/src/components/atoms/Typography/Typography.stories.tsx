import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
    title: "Atoms/Typography",
    component: Typography,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TypographyScale: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1 - 36px, bold-700</Typography>
      <Typography variant="h2">Heading 2 - 30px, bold-700</Typography>
      <Typography variant="h3">Heading 3 - 24px, bold-700</Typography>
      <Typography variant="h4">Heading 4 - 20px, bold-700</Typography>
      <Typography variant="h5">Heading 5 - 18px,semibold-600</Typography>
      <Typography variant="h6">Heading 6 - 16px, semibold-600</Typography>
      <Typography variant="body">Body - 16px, normal-400</Typography>
      <Typography variant="caption">Caption - 14px normal-400</Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'All typography variants in one place with font sizes and font-weights' },
    },
  },
};

export const Heading1: Story = {
    args: {
        variant: 'h1',
        children: 'Heading 1: font-size 36px, font-weight 700 (bold)',
    },
};

export const Heading2: Story = {
    args: {
        variant: 'h2',
        children: 'Heading 2: font-size 30px, font-weight 700 (bold)',
    },
};

export const Heading3: Story = {
    args: {
        variant: 'h3',
        children: 'Heading 3: font-size 24px, font-weight 700 (bold)',
    },
};

export const Heading4: Story = {
    args: {
        variant: 'h4',
        children: 'Heading 4: font-size 20px, font-weight 700 (bold)',
    },
};

export const Heading5: Story = {
    args: {
        variant: 'h5',
        children: 'Heading 5: font-size 18px, font-weight 600 (semi-bold)',
    },
};

export const Body: Story = {
    args: {
        variant: 'body',
        children: 'body: font-size 16px, font-weight 400 (normal)',
    },
};

export const Caption: Story = {
    args: {
        variant: 'caption',
        children: 'caption: font-size 14px, font-weight 400 (normal)',
    },
};

export const CollapsibleHeading: Story = {
    args: {
        variant: 'h3',
        children: 'Click to expand',
        collapsible: true,
    },
};
