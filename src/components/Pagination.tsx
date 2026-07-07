import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visiblePages = Array.from(
    new Set([1, page - 1, page, page + 1, totalPages]),
  ).filter((value) => value > 0 && value <= totalPages);

  return (
    <div className="pagination" aria-label="Users pagination">
      <div className="pagination__size">
        <span>Showing</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>out of {total}</span>
      </div>

      <div className="pagination__pages">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {visiblePages.map((item, index) => (
          <button
            type="button"
            key={item}
            className={item === page ? "is-active" : ""}
            onClick={() => onPageChange(item)}
          >
            {index > 0 && item - visiblePages[index - 1] > 1
              ? `... ${item}`
              : item}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
