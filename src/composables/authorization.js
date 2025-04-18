export const STORAGE_AUTHORIZE_KEY = "Platform-Admin-Token";
export const useAuthorization = createGlobalState(() =>
  useCookieStorage(STORAGE_AUTHORIZE_KEY, null)
);
