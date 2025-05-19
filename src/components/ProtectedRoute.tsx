import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseAuthRedirectProps {
  isAuthenticated: boolean;
  redirectTo: string;
}

const useAuthRedirect = ({ isAuthenticated, redirectTo }: UseAuthRedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, redirectTo, navigate]);
};

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children, redirectTo }) => {
  useAuthRedirect({ isAuthenticated, redirectTo });
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
