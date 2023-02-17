import { createContext, ReactNode, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { Grid, Spinner } from '@chakra-ui/react';

import { typedStorage } from '~/common/localStorage/TypeSafeLocalStorage';
import { useAuth } from '~/features/Login/hooks/useAuth';
import { setTokenWithHeader } from '~/libs/axios';

const AuthContext = createContext<ReturnType<typeof useAuth>>({} as never);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, login, logout, fetchUser, signUp } = useAuth();

  useEffect(() => {
    const token = typedStorage.get('accessToken');

    if (token) {
      setTokenWithHeader(token);
      void fetchUser();
    } else {
      logout();
    }
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, fetchUser, signUp }}>{children}</AuthContext.Provider>;
}

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  if (user === undefined) {
    return (
      <Grid h="100vh" w="100vw" placeContent="center">
        <Spinner size="lg">Loading...</Spinner>
      </Grid>
    );
  }

  if (user == null) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
