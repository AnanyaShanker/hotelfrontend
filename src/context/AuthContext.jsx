import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axiosConfig';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Role mapping
  const ROLES = {
    CUSTOMER: 1,
    STAFF: 2,
    MANAGER: 3,
    SUPERADMIN: 4,
  };

  // Get role name from role_id
  const getRoleName = (roleId) => {
    const roleMap = {
      1: 'CUSTOMER',
      2: 'STAFF',
      3: 'MANAGER',
      4: 'SUPERADMIN',
    };
    return roleMap[roleId] || 'CUSTOMER';
  };

  // Check if user has specific role
  const hasRole = (roleName) => {
    if (!user) return false;
    return getRoleName(user.roleId) === roleName;
  };

  // Check if user is admin (Manager or SuperAdmin)
  const isAdmin = () => {
    return hasRole('MANAGER') || hasRole('SUPERADMIN');
  };

  // Check if user is staff
  const isStaff = () => {
    return hasRole('STAFF');
  };

  // Check if user is customer
  const isCustomer = () => {
    return hasRole('CUSTOMER');
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      const { token, user: userData } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user function
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole,
    isAdmin,
    isStaff,
    isCustomer,
    getRoleName,
    ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

