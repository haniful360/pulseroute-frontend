'use client';

interface TableSkeletonProps {
  columnsCount?: number;
  rowsCount?: number;
}

const TableSkeleton = ({ columnsCount = 4, rowsCount = 10 }: TableSkeletonProps) => {
  const rows = Array.from({ length: rowsCount });
  const columns = Array.from({ length: columnsCount });

  const getWidthClass = (index: number) => {
    const widths = ['w-24', 'w-36', 'w-48', 'w-20', 'w-32'];
    return widths[index % widths.length];
  };

  return (
    <div className="w-full overflow-hidden border-t border-slate-800 bg-[#0B1120]">
      <table className="w-full table-fixed divide-y divide-slate-800">
        {/* Table Header */}
        <thead className="bg-[#0F172A]">
          <tr>
            {columns.map((_, colIndex) => (
              <th key={`th-${colIndex}`} className="px-6 py-4 text-left">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-700/40" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-800/60 bg-[#0B1120]">
          {rows.map((_, rowIndex) => (
            <tr key={`tr-${rowIndex}`} className="hover:bg-slate-900/10">
              {columns.map((_, colIndex) => (
                <td key={`td-${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {rowIndex % 2 === 0 && colIndex === 1 && (
                      <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-slate-800/80" />
                    )}

                    <div
                      className={`h-4 animate-pulse rounded bg-slate-800/90 ${getWidthClass(colIndex + rowIndex)}`}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
