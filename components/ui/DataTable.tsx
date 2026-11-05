"use client";

import { useMemo, useState } from "react";
import { Icon } from "./Icon";

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

const PAGE_SIZE = 15;

export function DataTable<T>({
  data,
  columns,
  getSearchText,
  searchPlaceholder,
  emptyMessage = "Nenhum registro encontrado.",
}: {
  data: T[];
  columns: Column<T>[];
  getSearchText: (row: T) => string;
  searchPlaceholder: string;
  emptyMessage?: string;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter((row) => getSearchText(row).toLowerCase().includes(query));
  }, [data, getSearchText, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div>
      <div className="mb-6 flex items-center rounded-2xl bg-surface-container-lowest p-4 shadow-[0_4px_20px_rgba(216,164,169,0.08)]">
        <div className="relative w-full">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-tertiary" />
          <input
            className="h-12 w-full rounded-full bg-surface-container-low pl-11 pr-4 font-body-sm text-body-sm text-on-surface outline-none ring-primary-container placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_8px_32px_rgba(216,164,169,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-high/60 text-on-surface">
                {columns.map((column) => (
                  <th key={column.key} className={`px-4 py-4 font-label-sm text-label-sm font-semibold uppercase tracking-wider ${column.className ?? ""}`} scope="col">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40">
              {pageRows.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-center font-body-md text-body-md text-on-surface-variant" colSpan={columns.length}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                pageRows.map((row, index) => (
                  <tr key={index} className="transition-colors hover:bg-surface-container-low/60">
                    {columns.map((column) => (
                      <td key={column.key} className={`px-4 py-4 align-middle ${column.className ?? ""}`}>
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-container-high/60 px-4 py-3">
          <p className="font-label-md text-label-md text-on-surface-variant">
            {filtered.length === 0 ? "0 registros" : `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} de ${filtered.length}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full bg-surface-container-low px-4 py-2 font-label-md text-label-md text-on-surface disabled:opacity-40"
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Anterior
            </button>
            <span className="font-label-md text-label-md text-on-surface">
              {currentPage} / {totalPages}
            </span>
            <button
              className="rounded-full bg-surface-container-low px-4 py-2 font-label-md text-label-md text-on-surface disabled:opacity-40"
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
