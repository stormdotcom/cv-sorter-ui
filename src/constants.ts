// Audio duration limits in seconds
export const API_URL_PROD = "https://api.textlens.xyz"
export const API_URL_DEV = "http://localhost:8000/api/v1"

export const STORAGE_KEYS = {
  TOKEN: 'token',
  GUEST_ID: 'g-id',
  GUEST_TOKEN: 'g-token',
  USER_ID: 'user',

};

; 

export const isGuest = () => {
  return localStorage.getItem(STORAGE_KEYS.GUEST_TOKEN)   !== null;
};
