import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH_LOGIN, PATH_ROOT } from '~/common/constants';
import * as api from '~/features/Login/apis/login';

export const useAuth = () => {
  const [user, setUser] = useState<api.User | undefined | null>(undefined);
  const navigate = useNavigate();

  // const signup = async (data) => {
  //   try {
  //     const response = await axios.post('/auth/signup', data);
  //     console.log(response.data);
  //     navigate('/');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      setUser(response.user);
      navigate(PATH_ROOT);
    } catch (error) {
      setUser(null);
      throw error;
    }
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

  return { user, login, fetchUser, setUser };
};
