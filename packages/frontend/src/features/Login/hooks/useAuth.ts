import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH_LOGIN, PATH_HOME } from '~/common/constants';
import { typedStorage } from '~/common/localStorage/TypeSafeLocalStorage';
import * as api from '~/features/Login/apis/login';

export const useAuth = () => {
  const [user, setUser] = useState<api.User | undefined | null>(undefined);
  const navigate = useNavigate();

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { user } = await api.signUp(email, password, name);
      setUser(user);
      navigate(PATH_HOME);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await api.login(email, password);
      setUser(user);
      navigate(PATH_HOME);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    typedStorage.remove('accessToken');
    typedStorage.remove('refreshToken');
    setUser(null);
    navigate(PATH_LOGIN);
  };

  const fetchUser = async () => {
    try {
      const user = await api.fetchUser();
      setUser(user);
    } catch (error) {
      setUser(null);
      navigate(PATH_LOGIN);
    }
  };

  return { user, login, signUp, logout, fetchUser };
};
