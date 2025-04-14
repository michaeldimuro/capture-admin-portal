import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Companies } from './pages/Companies';
import { CompanyDetails } from './pages/CompanyDetails';
import { Medications } from './pages/Medications';
import { MedicationOfferings } from './pages/MedicationOfferings';
import { Support } from './pages/Support';
import { Settings } from './pages/Settings';
import { Orders } from './pages/Orders';
import { OrderDetails } from './pages/OrderDetails';
import { Patients } from './pages/Patients';
import { PatientDetails } from './pages/PatientDetails';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';
import { authService } from './lib/api/services';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getToken, logout } = useAuthStore();
  const navigate = useNavigate();
  
  // Check token validity on route access
  useEffect(() => {
    const validateToken = async () => {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const isValid = await authService.validateToken(token);
        if (!isValid) {
          // Logout and redirect
          logout();
          navigate('/login');
        }
      } catch (error) {
        // In case of any error, redirect to login
        navigate('/login');
      }
    };
    
    validateToken();
  }, [navigate, getToken, logout]);
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
}

export default function App() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      
      {/* Super Admin Routes */}
      {isSuperAdmin && (
        <>
          <Route
            path="/medications"
            element={
              <PrivateRoute>
                <Medications />
              </PrivateRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <PrivateRoute>
                <Companies />
              </PrivateRoute>
            }
          />
          <Route
            path="/companies/:id"
            element={
              <PrivateRoute>
                <CompanyDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/support"
            element={
              <PrivateRoute>
                <Support />
              </PrivateRoute>
            }
          />
        </>
      )}
      
      {/* Company Admin Routes */}
      {!isSuperAdmin && (
        <Route
          path="/medication-offerings"
          element={
            <PrivateRoute>
              <MedicationOfferings />
            </PrivateRoute>
          }
        />
      )}
      
      {/* Shared Routes */}
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/orders/:id"
        element={
          <PrivateRoute>
            <OrderDetails />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <Patients />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/patients/:id"
        element={
          <PrivateRoute>
            <PatientDetails />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}