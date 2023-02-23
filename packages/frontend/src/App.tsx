import { Navigate, Outlet, Route, Routes } from 'react-router';

import { PATH_HOME, PATH_LOGIN, PATH_SIGNUP } from '~/common/constants';
import { Login, SignUp } from '~/features/Auth';
import { ProtectedRoute } from '~/features/Auth/contexts/authContext';
import { Profile } from '~/features/Profile';
import { SideBar } from '~/features/SideBar';
import { HorizontallyResizableLayout } from '~/layouts/HorizontallyResizableLayout';

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
        <Route path={PATH_HOME} element={<Profile />} />
      </Route>
      <Route path="/*" element={<Navigate to={PATH_LOGIN} />} />
    </Routes>
  );
};
