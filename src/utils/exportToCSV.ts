/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Utility function to convert data array to CSV and trigger browser download.
 *
 * @param headers - Array of column header titles
 * @param rowsData - Array of data objects
 * @param rowMapper - Callback function converting each item into array of cell values
 * @param filename - Output filename (e.g. 'audit_logs_2026-07-20')
 */
export const downloadCSV = <T extends Record<string, any>>(
  headers: string[],
  rowsData: T[],
  rowMapper: (item: T) => (string | number | boolean | null | undefined)[],
  filename: string,
) => {
  if (!rowsData || rowsData.length === 0) return;

  const sanitize = (val: unknown) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = rowsData.map((item) => {
    const cells = rowMapper(item);
    return cells.map((cell) => sanitize(cell)).join(',');
  });

  const csvContent = [headers.join(','), ...csvRows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
