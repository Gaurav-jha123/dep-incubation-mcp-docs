import React, { useState } from "react";

export interface TableProps {
  /** Table headers */
  headers: string[];

  /** Data array */
  data: Record<string, any>[];

  /** Keys from the data to display in each row */
  keys: string[];

  /** Rows per page */
  rowsPerPage?: number;

  /** Additional classes */
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  headers,
  data,
  keys,
  rowsPerPage = 5,
  className = "",
}) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = page * rowsPerPage;
  const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-left">
          {/* Header */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-4 py-3 font-semibold text-sm border-b">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {currentRows.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                {keys.map((key) => (
                  <td key={key} className="px-4 py-3 whitespace-nowrap text-gray-800">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-2 text-sm">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};