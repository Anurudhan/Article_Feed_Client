
import { Outlet } from 'react-router-dom';
import TransparentNavbar from '../../components/UI/TransparentNavbar';

const MainLayout = () => {
     const publicRoutes = ['/login', '/register'];
  const shouldShowNavbar = !publicRoutes.includes(location.pathname);
  return (
   <>
      {/* You can add Navbar/Footer here if needed */}
      {shouldShowNavbar && <TransparentNavbar />}
      <Outlet />
</>
  );
};

export default MainLayout;
