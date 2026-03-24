import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorPalette } from './ColorPalette';

const meta = {
    title: 'Foundations/Color Palette',
    component: ColorPalette,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Reference view for the semantic palette tokens defined in the application theme.',
            },
        },
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ColorPalette>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};