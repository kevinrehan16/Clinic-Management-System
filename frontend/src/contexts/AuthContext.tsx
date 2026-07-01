import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import apiClient from '../api/axiosInstance'; 

// 1. I-update ang interface para isama ang 'user'
interface AuthContextType {
  user: any | null; // Dito natin ilalagay ang user object
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsAuthenticated: (status: boolean) => void;
  login: (userData: any) => void; // Pinangalanan kong 'login' para mas malinaw
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null); // Added user state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // 2. I-update ang login function para tumanggap ng data
  const login = useCallback((userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('users/logout/'); 
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      setUser(null); // Linisin ang user data
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 3. Kunin ang response mula sa backend
        const response = await apiClient.get('users/auth/me/');
        
        // I-assume natin na ang API mo ay nagbabalik ng user data sa response.data
        setUser(response.data); 
        setIsAuthenticated(true);
      } catch (error) {
        if (axios.isCancel(error)) return;
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};