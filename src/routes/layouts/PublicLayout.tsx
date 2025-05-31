// layout/PublicLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../redux/hooks/useAuth';

const PublicLayout = () => {
  const user = useAuth();
  return user ? <Navigate to="/dashboard" /> :   <Outlet /> ;
};

export default PublicLayout;
