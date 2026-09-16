export type TAlertType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SYSTEM' | 'MAINTENANCE';
export type TAlertMethod = 'PUSH' | 'EMAIL' | 'SMS';

export interface TAlert {
  id: string;
  alertType: TAlertType;
  message: string;
  alertMethod: TAlertMethod;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TAlertListResponse {
  statusCode: number;
  message: string;
  data: TAlert[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TCreateAlertPayload {
  alertType: TAlertType;
  message: string;
  alertMethod: TAlertMethod;
}

export interface TUpdateAlertPayload {
  alertType?: TAlertType;
  message?: string;
  alertMethod?: TAlertMethod;
}
