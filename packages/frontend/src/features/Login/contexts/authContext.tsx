import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { typedStorage } from '~/common/localStorage/TypeSafeLocalStorage';
import { getUser, setTokenWithHeader, User } from '~/features/Login/apis/login';

const AuthContext = createContext<{ user: User | undefined | null; setContextUser: (user: User) => void }>({} as never);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const token = typedStorage.get('accessToken');

    if (token) {
      setTokenWithHeader(token);
      getUser()
        .then((u) => {
          setUser(u);
        })
        .catch(() => {
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setContextUser: (user) => setUser(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  if (user === undefined) {
    return <p>Loading...</p>;
  }

  if (user == null) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
