// layout/ProtectedLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../redux/hooks/useAuth';


const ProtectedLayout = () => {
  const user = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedLayout;
