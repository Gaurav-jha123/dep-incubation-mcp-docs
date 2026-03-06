import { useState, useMemo } from "react";
import { Listbox } from "@headlessui/react";

export interface TableProps<T> {
  headers: string[];
  data: T[];
  keys: (keyof T)[];
  rowsPerPageOptions?: number[];
  className?: string;
}

export const Table = <T extends Record<string, unknown>>({
  headers,
  data,
  keys,
  rowsPerPageOptions = [5, 10, 20],
  className = "",
}: TableProps<T>) => {
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(0);

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [search, setSearch] = useState("");

  /* Filtering */
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      keys.some((key) =>
        String(row[key]).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, keys, search]);

  /* Sorting */
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = String(a[sortKey]);
      const bValue = String(b[sortKey]);

      if (sortDir === "asc") return aValue.localeCompare(bValue);
      return bValue.localeCompare(aValue);
    });
  }, [filteredData, sortKey, sortDir]);

  /* Pagination */
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const startIndex = page * rowsPerPage;
  const currentRows = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      
      {/* Search Filter */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="border px-3 py-1 rounded w-60"
        />

        {/* Rows per page */}
        <Listbox value={rowsPerPage} onChange={setRowsPerPage}>
          <div className="relative">
            <Listbox.Button className="px-3 py-1 border rounded bg-white">
              Rows: {rowsPerPage}
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 bg-white border rounded shadow z-10">
              {rowsPerPageOptions.map((opt) => (
                <Listbox.Option
                  key={opt}
                  value={opt}
                  className={({ active }) =>
                    `px-3 py-1 cursor-pointer ${
                      active ? "bg-gray-100" : ""
                    }`
                  }
                >
                  {opt}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-left text-sm">
          
          {/* Header */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {headers.map((header, idx) => {
                const key = keys[idx];

                return (
                  <th
                    key={idx}
                    onClick={() => handleSort(key)}
                    className="px-4 py-3 font-semibold border-b cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      {header}

                      {sortKey === key && (
                        <span>
                          {sortDir === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {currentRows.map((row, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-gray-50 transition"
              >
                {keys.map((key) => (
                  <td
                    key={String(key)}
                    className="px-4 py-3 text-gray-800 whitespace-nowrap"
                  >
                    {String(row[key])}
                  </td>
                ))}
              </tr>
            ))}

            {currentRows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-6 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

Table.displayName = "Table";