import { useState, useMemo } from "react";
import { Listbox } from "@headlessui/react";

export interface TableProps<T> {
  headers: string[];
  data: T[];
  keys: (keyof T)[];
  rowsPerPageOptions?: number[];
  className?: string;
  showSearch?: boolean;
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;

  // Optional custom cell renderer
  cellRenderer?: (value: unknown, key: keyof T, row: T) => React.ReactNode;
}

export const Table = <T extends Record<string, unknown>>({
  headers,
  data,
  keys,
  rowsPerPageOptions = [5, 10, 20],
  className = "",
  showSearch = true,
  stickyHeader = false,
  stickyFirstColumn = false,
  cellRenderer,
}: TableProps<T>) => {
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(0);

  const [prevDefaultRowOption, setPrevDefaultRowOption] = useState(
    rowsPerPageOptions[0],
  );

  if (rowsPerPageOptions[0] !== prevDefaultRowOption) {
    setPrevDefaultRowOption(rowsPerPageOptions[0]);
    setRowsPerPage(rowsPerPageOptions[0]);
    setPage(0);
  }

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [search, setSearch] = useState("");

  /* Filtering */
  const filteredData = useMemo(() => {
    if (!showSearch || !search) return data;

    return data.filter((row) =>
      keys.some((key) =>
        String(row[key]).toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [data, keys, search, showSearch]);

  /* Sorting */
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      const isNumeric = (val: unknown) =>
        val !== "" && val !== null && val !== undefined && !isNaN(Number(val));

      if (isNumeric(aValue) && isNumeric(bValue)) {
        const diff = Number(aValue) - Number(bValue);
        return sortDir === "asc" ? diff : -diff;
      }

      const aStr = String(aValue ?? "");
      const bStr = String(bValue ?? "");

      if (sortDir === "asc") return aStr.localeCompare(bStr);
      return bStr.localeCompare(aStr);
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
      {(showSearch || rowsPerPageOptions.length > 1) && (
        <div className="flex justify-between items-center">
          {showSearch ? (
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
          ) : (
            <div />
          )}

          {rowsPerPageOptions.length > 1 && (
            <Listbox value={rowsPerPage} onChange={setRowsPerPage}>
              <div className="relative">
                <Listbox.Button className="px-3 py-1 border rounded bg-secondary-50">
                  Rows: {rowsPerPage}
                </Listbox.Button>

                <Listbox.Options className="absolute right-0 mt-1 bg-secondary-50 border rounded shadow z-10">
                  {rowsPerPageOptions.map((opt) => (
                    <Listbox.Option
                      key={opt}
                      value={opt}
                      className={({ active }) =>
                        `px-3 py-1 cursor-pointer ${
                          active ? "bg-secondary-200" : ""
                        }`
                      }
                    >
                      {opt}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto border border-secondary-200 rounded-lg max-h-full">
        <table className="table-fixed min-w-full text-left text-sm">
          <thead className={`bg-secondary-200 text-secondary-700 ${stickyHeader ? "sticky top-0 z-20" : ""}`}>
            <tr>
              {headers.map((header, idx) => {
                const key = keys[idx];

                return (
                  <th
                    key={idx}
                    onClick={() => handleSort(key)}
                    className={`w-[100px] max-w-[150px] h-[50px] px-3 py-2 font-semibold border-b cursor-pointer select-none align-top bg-secondary-50 ${
                      stickyFirstColumn && idx === 0 ? "sticky left-0 z-30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-1">
                      <span
                        className="line-clamp-2 leading-tight"
                        title={header}
                      >
                        {header}
                      </span>

                      {sortKey === key && (
                        <span className="flex-shrink-0">
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
              <tr key={idx} className="border-b hover:bg-secondary-50 transition">
                {keys.map((key, colIdx) => {
                  const value = row[key];

                  return (
                    <td
                      key={String(key)}
                      className={`text-secondary-900 whitespace-nowrap ${
                        stickyFirstColumn && colIdx === 0
                          ? "sticky left-0 z-10 bg-primary-50"
                          : ""
                      }`}
                    >
                      {cellRenderer
                        ? cellRenderer(value, key, row)
                        : value !== undefined
                          ? String(value)
                          : ""}
                    </td>
                  );
                })}
              </tr>
            ))}

            {currentRows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-6 text-secondary-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-5 text-sm">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-secondary-200 disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page === totalPages - 1 || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-secondary-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

Table.displayName = "Table";
