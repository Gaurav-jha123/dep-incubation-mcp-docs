import React from 'react';
import { Menu } from '@headlessui/react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPageButtons = () => {
        const pages: React.ReactNode[] = [];
        const maxVisible = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        const addButton = (p: number) => (
            <Menu.Item key={p}>
                {({ active }) => (
                    <button
                        onClick={() => onPageChange(p)}
                        className={`px-3 py-1 text-sm border rounded ${
                            currentPage === p
                                ? 'bg-blue-500 text-white border-blue-500'
                                : active
                                ? 'bg-gray-100'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {p}
                    </button>
                )}
            </Menu.Item>
        );

        if (startPage > 1) {
            pages.push(
                <Menu.Item key={1}>
                    {({ active }) => (
                        <button
                            onClick={() => onPageChange(1)}
                            className={`px-3 py-1 text-sm border rounded ${
                                active ? 'bg-gray-100' : 'hover:bg-gray-100'
                            }`}
                        >
                            1
                        </button>
                    )}
                </Menu.Item>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="dots-start" className="px-2">
                        ...
                    </span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(addButton(i));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="dots-end" className="px-2">
                        ...
                    </span>
                );
            }
            pages.push(
                <Menu.Item key={totalPages}>
                    {({ active }) => (
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className={`px-3 py-1 text-sm border rounded ${
                                active ? 'bg-gray-100' : 'hover:bg-gray-100'
                            }`}
                        >
                            {totalPages}
                        </button>
                    )}
                </Menu.Item>
            );
        }

        return pages;
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>

            <Menu as="nav" className="flex gap-1">
                <Menu.Items static className="flex gap-1">
                    {renderPageButtons()}
                </Menu.Items>
            </Menu>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};
