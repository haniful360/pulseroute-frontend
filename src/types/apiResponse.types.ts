/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
  totalPages?: number;
}

export interface TResponseRedux<T> {
  data?: T;
  meta?: TMeta;
  success?: boolean;
  message?: string;
  statusCode?: number;
}

export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};

export interface IGlobalErrorResponse {
  statusCode: number;
  message: string;
  errorMessages?: Array<{
    path: string | number;
    message: string;
  }>;
  data?: any;
}
