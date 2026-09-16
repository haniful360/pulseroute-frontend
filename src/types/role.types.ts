export interface IRolePermissions {
  canManageUsers: boolean;
  canManageContent: boolean;
  canManageBilling: boolean;
  canManageSettings: boolean;
}

export interface IRole {
  roleId: string;
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: IRolePermissions;
}

export interface IGetRolesResponse {
  statusCode: number;
  message: string;
  data: IRole[];
}

export interface IUpdateRolePermissionsPayload {
  id: string;
  permissions: IRolePermissions;
}

export interface IUpdateRolePermissionsResponse {
  statusCode: number;
  message: string;
  data: IRole;
}
