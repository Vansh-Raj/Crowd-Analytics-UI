import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../lib/api';

interface Props {
  children: ReactNode;
}

function PublicRoute({ children }: Props) {
  const token = getToken();
  if (token) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}

export default PublicRoute;
