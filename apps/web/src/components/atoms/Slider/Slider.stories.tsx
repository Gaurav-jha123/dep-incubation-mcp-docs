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
    parameters: {
        docs: {
            description: {
                story: 'A basic slider for selecting a value within a range.'
            }
        }
    },
    render: (args: SliderStoryArgs) => <SliderWrapper {...args} />,
    args: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        ariaLabel: 'Default slider',
    },
};

export const CustomRange: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Slider with a custom min, max, and step.'
            }
        }
    },
    render: (args: SliderStoryArgs) => <SliderWrapper {...args} />,
    args: {
        value: 20,
        min: 10,
        max: 30,
        step: 2,
        ariaLabel: 'Custom range slider',
    },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A slider in a disabled state.'
            }
        }
    },
    render: (args: SliderStoryArgs) => <SliderWrapper {...args} />,
    args: {
        value: 40,
        disabled: true,
        ariaLabel: 'Disabled slider',
    },
};
// Pseudo states for demonstration (visual only)
const pseudoStates = [
    { label: 'Default', props: {} },
    { label: 'Focus', props: { 'data-focus': true } },
    { label: 'Disabled', props: { disabled: true } },
];

export const PseudoStates: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Slider with various pseudo states (visual only, not interactive).',
            },
        },
        layout: 'centered',
    },
    render: (args: SliderStoryArgs) => (
        <div className="flex gap-8 items-center justify-center">
            {pseudoStates.map(({ label, props }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-neutral-500">{label}</span>
                    <Slider {...args} {...props} aria-label={label + ' slider'} />
                </div>
            ))}
        </div>
    ),
    args: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
    },
};
