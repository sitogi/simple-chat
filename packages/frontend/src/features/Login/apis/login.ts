import { isAxiosError } from 'axios';

import { typedStorage } from '~/common/localStorage/TypeSafeLocalStorage';
import axios from '~/libs/axios';

export function setTokenWithHeader(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function login(email: string, password: string): Promise<{ user: User }> {
  try {
    const response = await axios.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = response.data;
    setTokenWithHeader(accessToken);

    typedStorage.set('accessToken', accessToken);
    typedStorage.set('refreshToken', refreshToken);

    return { user };
  } catch (e) {
    typedStorage.remove('accessToken');
    typedStorage.remove('refreshToken');
    if (isAxiosError(e)) {
      if (e.response?.status === 401) {
        throw new Error(e.response.data);
      }
    }

    throw new Error('Unexpected error');
  }
}

export type User = { id: number; email: string; name: string; created_at: Date; updated_at: Date };

export async function getUser(): Promise<User> {
  try {
    const response = await axios.get('/auth/user');
    const user = response.data;

    return user;
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response?.status === 401) {
        typedStorage.remove('accessToken');
        typedStorage.remove('refreshToken');
        throw new Error(e.response.data);
      }
    }

    throw new Error('Unexpected error');
  }
}
