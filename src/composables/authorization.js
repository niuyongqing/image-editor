
export const STORAGE_AUTHORIZE_KEY = 'Admin-Token'
export const useAuthorization = createGlobalState(() => useCookieStorage(STORAGE_AUTHORIZE_KEY,null))
