import { ITableProps } from '@/types/custom-table.types';

const CustomTable = <T extends object>({ columns, data }: ITableProps<T>) => {
  return (
    <div className="custom-scrollbar overflow-x-auto border-t">
      <table className="min-w-full divide-y">
        <thead className="bg-[#0F172A]">
          <tr>
            {columns?.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold tracking-wider text-nowrap text-[#94A3B8]"
              >
                {column?.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns?.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-sm whitespace-nowrap text-[#94A3B8]">
                  {'accessor' in column && column?.accessor
                    ? String(row[column?.accessor] ?? '')
                    : column?.cell?.(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
