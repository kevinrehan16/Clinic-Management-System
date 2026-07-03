import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 1. Siguraduhin na naka-import ang ThemeProvider
import { ThemeProvider } from './contexts/ThemeContext'; 
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';
import LoadingScreen from './components/ui/LoadingScreen';

// PAGES
import AdminDashboard from './pages/dashboards/AdminDashboard';
import Patients from './pages/patients/patients';

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const queryClient = new QueryClient();
  
  return (
    // 2. I-wrap ang buong app sa ThemeProvider
    <QueryClientProvider client={queryClient}>
      <ThemeProvider> 
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/patients" element={<Patients />} />
                </Route>
              </Route>
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;