import { Grid, Text } from '@chakra-ui/react';
import { Navigate, Outlet, Route, Routes } from 'react-router';

import { PATH_LOGIN, PATH_ROOT } from '~/common/constants';
import { Login } from '~/features/Login';
import { ProtectedRoute, useAuthContext } from '~/features/Login/contexts/authContext';
import { HorizontallyResizableLayout } from '~/layouts/HorizontallyResizableLayout';

const SideBar = () => {
  return (
    <Grid placeContent="center" h="full" w="full">
      サイドバー
    </Grid>
  );
};

const TopPage = () => {
  const { user } = useAuthContext();

  return (
    <Grid placeContent="center" h="full" w="full">
      <Text>ログインしました。</Text>
      <Text>{JSON.stringify(user)}</Text>
    </Grid>
  );
};

export const App = () => {
  return (
    <Routes>
      <Route path={PATH_LOGIN} element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <HorizontallyResizableLayout aside={<SideBar />} main={<Outlet />} />
          </ProtectedRoute>
        }
      >
        <Route path={PATH_ROOT} element={<TopPage />} />
      </Route>
      <Route path="/*" element={<Navigate to={PATH_LOGIN} />} />
    </Routes>
  );
};
