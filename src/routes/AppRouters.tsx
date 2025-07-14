// App.tsx or AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../page/Login';
import Dashboard from '../page/Dashboard';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import CreateArticle from '../page/CreateArticle';
import EditArticle from '../page/EditArticle';
import ProfilePage from '../page/ProfilePage';
import RegistrationForm from '../components/Registration';
import MyArticle from '../page/MyArticle';


function AppRoutes() {
  return (
    <Routes>

      {/* Main layout (Navbar/footer common) */}
      <Route path="/" element={<MainLayout />}>
         <Route index element={<Dashboard />} />
        {/* Public routes: only for users NOT logged in */}
        <Route element={<PublicLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegistrationForm />} />
        </Route>

        {/* Common page (Dashboard) */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Protected routes: only for logged-in users */}
        <Route element={<ProtectedLayout />}>
            <Route path="myarticle" element={<MyArticle />} />
            <Route path="create" element={<CreateArticle />} />
            <Route path="edit" element={<EditArticle />} />
            <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback 404 route */}
        {/* <Route path="*" element={<h1>404 Not Found</h1>} /> */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
