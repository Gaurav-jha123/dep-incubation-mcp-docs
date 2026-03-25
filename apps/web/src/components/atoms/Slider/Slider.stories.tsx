import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

import { useState } from 'react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
    title: "Atoms/Slider",
    component: Slider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;
type SliderStoryArgs = ComponentProps<typeof Slider>;

const SliderWrapper = (args: SliderStoryArgs) => {
    const [value, setValue] = useState(args.value || 0);
    return <Slider {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
    render: (args: SliderStoryArgs) => <SliderWrapper {...args} />,
    args: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
    },
};

export const CustomRange: Story = {
    render: (args: SliderStoryArgs) => <SliderWrapper {...args} />,
    args: {
        value: 20,
        min: 10,
        max: 30,
        step: 2,
    },
};

export const Disabled: Story = {
    render: (args: SliderStoryArgs) => <SliderWrapper {...args} />,
    args: {
        value: 40,
        disabled: true,
    },
};
