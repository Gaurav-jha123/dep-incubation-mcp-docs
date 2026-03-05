import { useState } from "react";

export interface TableProps<T> {
  /** Table headers */
  headers: string[];

  /** Data array */
  data: T[];

  /** Keys from the data to display in each row */
  keys: (keyof T)[];

  /** Rows per page */
  rowsPerPage?: number;

  /** Additional classes */
  className?: string;
}

export const Table = <T extends Record<string, unknown>>({
  headers,
  data,
  keys,
  rowsPerPage = 5,
  className = "",
}: TableProps<T>) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = page * rowsPerPage;
  const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className={`w-full space-y-3 ${className}`}>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-4 py-3 font-semibold text-sm border-b">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                {keys.map((key) => (
                  <td key={String(key)} className="px-4 py-3 whitespace-nowrap text-gray-800">
                    {String(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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