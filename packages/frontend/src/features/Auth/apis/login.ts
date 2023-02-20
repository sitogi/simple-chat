import { isAxiosError } from 'axios';

import { typedStorage } from '~/common/localStorage/TypeSafeLocalStorage';
import axios, { setTokenWithHeader } from '~/libs/axios';

export async function signUp(email: string, password: string, name: string): Promise<{ user: User }> {
  try {
    const response = await axios.post('/auth/signup', { email, password, name });
    const { user, accessToken, refreshToken } = response.data;
    setTokenWithHeader(accessToken);

    typedStorage.set('accessToken', accessToken);
    typedStorage.set('refreshToken', refreshToken);

    return { user };
  } catch (e) {
    typedStorage.remove('accessToken');
    typedStorage.remove('refreshToken');
    if (isAxiosError(e)) {
      throw new Error(e.response?.data);
    }

    throw e;
  }
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
      throw new Error(e.response?.data);
    }

    throw e;
  }
}

export async function logout(): Promise<void> {
  try {
    await axios.post('/auth/logout');
  } catch (e) {
    console.error(e);
  } finally {
    typedStorage.remove('accessToken');
    typedStorage.remove('refreshToken');
  }
}

export type User = { id: number; email: string; name: string; created_at: Date; updated_at: Date };

export async function fetchUser(): Promise<User> {
  try {
    const response = await axios.get('/auth/user');
    const user = response.data;

    return user;
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response?.status === 401) {
        typedStorage.remove('accessToken');
        typedStorage.remove('refreshToken');
      }
      throw new Error(e.response?.data);
    }

    throw e;
  }
}
