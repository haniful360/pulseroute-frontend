import React from 'react';
import { ITableProps } from '@/types/custom-table.types';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/shared/EmptyState/EmptyState';
import { LucideIcon } from 'lucide-react';

const CustomTable = <T extends object>({
  columns,
  data,
  className,
  headerClassName,
  variant = 'light',
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items to display at this time.',
  emptyIcon,
}: ITableProps<T>) => {
  const isLight = variant === 'light';

  return (
    <div
      className={cn(
        'custom-scrollbar w-full max-w-full min-w-0 overflow-x-auto border-t border-slate-100',
        className,
      )}
    >
      <table className="w-full min-w-full divide-y divide-slate-100">
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
                className="py-12 px-6"
              >
                <EmptyState
                  variant={variant}
                  title={emptyTitle}
                  description={emptyDescription}
                  icon={emptyIcon as LucideIcon}
                  className="border-none bg-transparent shadow-none py-4 sm:py-6"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
