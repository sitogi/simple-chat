import { Navigate, Outlet, Route, Routes } from 'react-router';

import { PATH_LOGIN } from '~/common/constants';
import { Login } from '~/features/Login';
import { HorizontallyResizableLayout } from '~/layouts/HorizontallyResizableLayout';

export const App = () => {
  return (
    <Routes>
      <Route path={PATH_LOGIN} element={<Login />} />
      <Route element={<HorizontallyResizableLayout main={<Outlet />} />}></Route>
      <Route path="/*" element={<Navigate to={PATH_LOGIN} />} />
    </Routes>
  );
};
