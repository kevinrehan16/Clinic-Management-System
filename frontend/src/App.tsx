import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// 1. Siguraduhin na naka-import ang ThemeProvider
import { ThemeProvider } from './contexts/ThemeContext'; 
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    // 2. I-wrap ang buong app sa ThemeProvider
    <ThemeProvider> 
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<div>Welcome to Dashboard</div>} />
                <Route path="/patients" element={<div>Patient Management Module</div>} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;