import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
    title: "Organisms/Pagination",
    component: Pagination,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const PaginationWrapper = (args: React.ComponentProps<typeof Pagination>) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
};

export const Default: Story = {
    render: (args) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 1,
        totalPages: 10,
    },
};

export const MultiplePages: Story = {
    render: (args) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 5,
        totalPages: 20,
    },
};

export const TwoPages: Story = {
    render: (args) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 1,
        totalPages: 2,
    },
};

export const LastPage: Story = {
    render: (args) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 10,
        totalPages: 10,
    },
};
