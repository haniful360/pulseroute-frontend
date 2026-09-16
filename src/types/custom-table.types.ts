/* eslint-disable no-unused-vars */
import React from 'react';

export type TColumn<T> =
  | {
      header: string;
      accessor: keyof T;
      cell?: (row: T, index?: number) => React.ReactNode;
    }
  | {
      header: string;
      accessor?: never;
      cell: (row: T, index?: number) => React.ReactNode;
    };

export interface ITableProps<T> {
  columns: TColumn<T>[];
  data: T[];
}
