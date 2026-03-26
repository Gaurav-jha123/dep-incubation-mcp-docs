import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  pseudoState?:
    | 'none'
    | 'hover'
    | 'active'
    | 'focus'
    | 'focus-visible'
    | 'disabled';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  pseudoState = 'none',
}) => {
  const isPseudoDisabled = pseudoState === 'disabled';

  const baseButtonClasses =
    'px-3 py-1 text-sm border rounded transition-[background-color,border-color,color,box-shadow] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/40 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent data-[pseudo-state=hover]:bg-neutral-200 data-[pseudo-state=active]:bg-neutral-300 data-[pseudo-state=focus]:ring-2 data-[pseudo-state=focus]:ring-offset-2 data-[pseudo-state=focus]:ring-primary-500/40 data-[pseudo-state=focus-visible]:ring-2 data-[pseudo-state=focus-visible]:ring-offset-2 data-[pseudo-state=focus-visible]:ring-primary-500/40';

  const handlePrevious = () => {
    if (currentPage > 1 && !isPseudoDisabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isPseudoDisabled) {
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
      <button
        key={p}
        onClick={() => onPageChange(p)}
        disabled={isPseudoDisabled}
        data-pseudo-state={pseudoState === 'none' ? undefined : pseudoState}
        className={`${baseButtonClasses} ${
          currentPage === p
            ? "bg-primary-500 text-neutral-50 border-primary-500"
            : ''
        }`}
      >
        {p}
      </button>
    );

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          disabled={isPseudoDisabled}
          data-pseudo-state={pseudoState === 'none' ? undefined : pseudoState}
          className={baseButtonClasses}
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
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          disabled={isPseudoDisabled}
          data-pseudo-state={pseudoState === 'none' ? undefined : pseudoState}
          className={baseButtonClasses}
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
        disabled={currentPage === 1 || isPseudoDisabled}
        data-pseudo-state={pseudoState === 'none' ? undefined : pseudoState}
        className={baseButtonClasses}
      >
        Previous
      </button>

      <nav className="flex gap-1" aria-label="Pagination">
        {renderPageButtons()}
      </nav>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || isPseudoDisabled}
        data-pseudo-state={pseudoState === 'none' ? undefined : pseudoState}
        className={baseButtonClasses}
      >
        Next
      </button>
    </div>
  );
};
