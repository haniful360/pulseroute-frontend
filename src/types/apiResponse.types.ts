export interface IGlobalErrorResponse {
  statusCode: number;
  message: string;
  errorMessages?: Array<{ path: string | number; message: string }>;
  data?: any;
}

export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};

export interface TResponseRedux<T> {
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
  success?: boolean;
  message?: string;
}
