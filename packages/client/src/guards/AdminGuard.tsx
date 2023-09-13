import { FC } from 'react';
import { Outlet } from 'react-router-dom';

declare const window: any;
export const AdminGuard: FC = () => {
  return <Outlet />;
};
