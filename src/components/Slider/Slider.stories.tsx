import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
    title: 'Components/Slider',
    component: Slider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const SliderWrapper = (args: React.ComponentProps<typeof Slider>) => {
    const [value, setValue] = useState(args.value || 0);
    return <Slider {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
    render: (args) => <SliderWrapper {...args} />,
    args: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
    },
};

export const CustomRange: Story = {
    render: (args) => <SliderWrapper {...args} />,
    args: {
        value: 20,
        min: 10,
        max: 30,
        step: 2,
    },
};

export const Disabled: Story = {
    render: (args) => <SliderWrapper {...args} />,
    args: {
        value: 40,
        disabled: true,
    },
};
