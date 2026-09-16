export type ColItem = { label: string; href: string };

export type NavLink = {
  label: string;
  href: string;
  mega?: boolean;
  heading?: string;
  columns?: ColItem[][];
};

export interface INavLinkVisibilityConfig {
  id: string;
  isIndustriesEnabled: boolean;
  isCapabilitiesEnabled: boolean;
  isProductsEnabled: boolean;
  isInsightsEnabled: boolean;
  isServicesEnabled: boolean;
  isCareersEnabled: boolean;
  updatedAt?: string;
}

export interface IUpdateNavLinkVisibilityPayload {
  isIndustriesEnabled?: boolean;
  isCapabilitiesEnabled?: boolean;
  isProductsEnabled?: boolean;
  isInsightsEnabled?: boolean;
  isServicesEnabled?: boolean;
  isCareersEnabled?: boolean;
}

export interface INavLinkConfigResponse {
  statusCode: number;
  message: string;
  data: INavLinkVisibilityConfig;
}
