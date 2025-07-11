import { API_URL, USER_ID } from '@env';

export const API_CONFIG = {
  BASE_URL: __DEV__ ? API_URL : '',
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  ENDPOINTS: {
    TASKS: '/tasks',
  },
  USER_ID: USER_ID
} as const;
