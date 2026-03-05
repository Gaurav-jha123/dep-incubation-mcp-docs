import React from 'react';

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
        const pages = [];
        const maxVisible = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            pages.push(
                <button
                    key="1"
                    onClick={() => onPageChange(1)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                >
                    1
                </button>
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
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-1 text-sm border rounded ${currentPage === i
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'hover:bg-gray-100'
                        }`}
                >
                    {i}
                </button>
            );
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
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                >
                    {totalPages}
                </button>
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

            <div className="flex gap-1">{renderPageButtons()}</div>

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
