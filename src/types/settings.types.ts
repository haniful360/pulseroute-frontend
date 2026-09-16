export interface IMaintenanceStatus {
  isUnderMaintenance: boolean;
  message?: string;
  endTime?: string;
  updatedAt: string;
}

export interface IMaintenanceStatusResponse {
  statusCode: number;
  message: string;
  data: IMaintenanceStatus;
}

export interface IUpdateMaintenancePayload {
  isUnderMaintenance: boolean;
  message?: string;
  endTime?: string;
}
