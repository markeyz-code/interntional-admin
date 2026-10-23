import { GATEWAY_ENDPOINT_WITH_AUTH, cachedGet } from '../axios.config';

export const siteSettingsApi = {
  getSettings: (platform: string) => cachedGet(`/site-settings/${platform}`),
  updateSettings: (platform: string, data: any) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch(`/site-settings/${platform}`, data),
};
