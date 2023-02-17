import { Grid, Text } from '@chakra-ui/react';
import { Navigate, Outlet, Route, Routes } from 'react-router';

import { PATH_HOME, PATH_LOGIN, PATH_SIGNUP } from '~/common/constants';
import { Login, Logout, SignUp } from '~/features/Auth';
import { ProtectedRoute, useAuthContext } from '~/features/Auth/contexts/authContext';
import { HorizontallyResizableLayout } from '~/layouts/HorizontallyResizableLayout';

const SideBar = () => {
  return (
    <Grid placeContent="center" h="full" w="full">
      サイドバー
    </Grid>
  );
};

const TopPage = () => {
  const { user, logout } = useAuthContext();

  return (
    <Grid placeContent="center" h="full" w="full" gap={4}>
      <Text>ログインしました。</Text>
      <Text>{JSON.stringify(user)}</Text>
      <Logout />
    </Grid>
  );
};

export const App = () => {
  return (
    <Routes>
      <Route path={PATH_LOGIN} element={<Login />} />
      <Route path={PATH_SIGNUP} element={<SignUp />} />
      <Route
        element={
          <ProtectedRoute>
            <HorizontallyResizableLayout aside={<SideBar />} main={<Outlet />} />
          </ProtectedRoute>
        }
      >
        <Route path={PATH_HOME} element={<TopPage />} />
      </Route>
      <Route path="/*" element={<Navigate to={PATH_LOGIN} />} />
    </Routes>
  );
};
