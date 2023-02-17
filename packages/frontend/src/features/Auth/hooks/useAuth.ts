import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH_HOME, PATH_LOGIN } from '~/common/constants';
import * as api from '~/features/Auth/apis/login';

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

  const logout = async () => {
    await api.logout();
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

  return { user, login, signUp, logout, fetchUser, setUser };
};
