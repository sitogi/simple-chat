import axios from 'axios';

import { typedStorage } from '~/common/localStorage/TypeSafeLocalStorage';

export function setTokenWithHeader(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axios.defaults.baseURL = 'api';

// 401 のときにトークンのリフレッシュを試みる
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalConfig = error.config;
    if (error.response.status === 401 && originalConfig.url === '/auth/refresh_token') {
      typedStorage.remove('accessToken');
      typedStorage.remove('refreshToken');

      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      const refreshToken = typedStorage.get('refreshToken');

      return axios.post('/auth/token-refresh', { refreshToken }).then((response) => {
        const { accessToken } = response.data;
        originalConfig.headers['Authorization'] = `Bearer ${accessToken}`;
        typedStorage.set('accessToken', accessToken);

        return axios(originalConfig);
      });
    }

    return Promise.reject(error);
  },
);

export default axios;
