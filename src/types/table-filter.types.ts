/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type ITableFilterType = 'search' | 'select' | 'date';

export interface ITableFilter {
  type: ITableFilterType;
  name: string;
  placeholder?: string;
  value?: any;
  options?: { label: string; value: string }[];
  onChange: (value: any) => void;
}
