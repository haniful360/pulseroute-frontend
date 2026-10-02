import React from 'react';
import { ITableProps } from '@/types/custom-table.types';
import { cn } from '@/lib/utils';

const CustomTable = <T extends object>({
  columns,
  data,
  className,
  headerClassName,
  variant = 'light',
}: ITableProps<T>) => {
  const isLight = variant === 'light';

  return (
    <div className={cn('custom-scrollbar overflow-x-auto border-t border-slate-100', className)}>
      <table className="min-w-full divide-y divide-slate-100">
        <thead
          className={cn(
            isLight
              ? 'border-b border-slate-200 bg-slate-50/90'
              : 'border-b border-slate-800 bg-[#0F172A]',
            headerClassName,
          )}
        >
          <tr>
            {columns?.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={cn(
                  'px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-nowrap',
                  isLight ? 'text-slate-600' : 'text-[#94A3B8]',
                )}
              >
                {column?.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn('divide-y', isLight ? 'divide-slate-100' : 'divide-slate-800')}>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'transition-colors',
                  isLight ? 'hover:bg-slate-50/70' : 'hover:bg-slate-800/40',
                )}
              >
                {columns?.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      'px-6 py-4 text-sm whitespace-nowrap',
                      isLight ? 'text-slate-600 font-medium' : 'text-[#94A3B8]',
                    )}
                  >
                    {'accessor' in column && column?.accessor
                      ? String(row[column?.accessor] ?? '')
                      : column?.cell?.(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns?.length || 1}
                className={cn(
                  'px-6 py-12 text-center text-sm font-medium',
                  isLight ? 'text-slate-400' : 'text-slate-500',
                )}
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
