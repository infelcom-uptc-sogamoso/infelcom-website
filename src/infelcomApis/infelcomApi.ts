import axios from 'axios';
import type { Messages } from '@/i18n/messages';

const infelcomApi = axios.create({
  baseURL: '/api',
});

/** User-facing message for a failed admin request (network, auth, validation, server). */
export const apiErrorMessage = (error: unknown, t: Messages) => {
  if (!axios.isAxiosError(error)) return t.admin.saveError;
  if (!error.response) return t.admin.networkError;
  if (error.response.status === 401) return t.admin.unauthorized;
  if (error.response.status === 400) return t.admin.invalidData;
  return t.admin.saveError;
};

export default infelcomApi;
