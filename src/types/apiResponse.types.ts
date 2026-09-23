/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TResponseRedux<T> {
  data: T;
  meta?: TMeta;
  success?: boolean;
  message?: string;
  statusCode?: number;
}

export interface TQueryParam {
  name: string;
  value: boolean | React.Key;
}

export interface IGlobalErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: {
    path: string | number;
    message: string;
  }[];
  data?: any;
}
