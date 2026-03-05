import React from "react";
import type { sortOrder } from "./SkillMatrixTable";

interface SkillMatrixFiltersProps {
  sortColumn: string;
  sortOrder: sortOrder;
  columnOptions: string[];
  onSortColumnChange: (column: string) => void;
  onSortOrderChange: (order: sortOrder) => void;
}

const SkillMatrixFilters: React.FC<SkillMatrixFiltersProps> = ({
  sortColumn,
  sortOrder,
  columnOptions,
  onSortColumnChange,
  onSortOrderChange,
}) => {
  return (
    <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      {/* Filter 1: Column Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Sort By</label>
        <select
          value={sortColumn}
          onChange={(e) => onSortColumnChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {columnOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 2: Sort Order */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Order</label>
        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as sortOrder)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default SkillMatrixFilters;