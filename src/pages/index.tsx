import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

import LoginPage from '@/pages/Login/LoginPage';
import LandingPage from '@/pages/LandingPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DashboardPage, CampaignsPage,  NewCampaignPage, CampaignsDetailPage } from '@/pages/Dashboard/';

// En una aplicación real, isAuthenticated se obtendría de un contexto de autenticación, Redux, Zustand, etc.
// Por ahora, para que funcione con el ejemplo, la pasaremos como prop.
// Idealmente, ProtectedRoute debería consumir un contexto para saber si el usuario está autenticado.
interface RoutingProps {
  isAuthenticated: boolean;
}

// const routes = [{ path: '/', Page: Home }];

function Routing({ isAuthenticated }: RoutingProps) {
//   const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);
//   return <Routes>{getRoutes()}</Routes>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Ruta protegida para el dashboard y sus sub-rutas */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/login">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="overview" element={<DashboardPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="new-campaign" element={<NewCampaignPage />} />
        <Route path="campaigns/:id" element={<CampaignsDetailPage />} />
      </Route>
    </Routes>
  );
}

export { Routing };
