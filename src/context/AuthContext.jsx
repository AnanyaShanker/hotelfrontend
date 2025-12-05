import { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosConfig';

const AuthContext = createContext(null);

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
      console.log('🔐 Logging in with /api/auth/login...');

      const response = await axios.post('/api/auth/login', { email, password });

      console.log('📦 Full response:', response);
      console.log('📦 Response data:', response.data);

      // Handle multiple possible response structures
      let token, userData;

      // Backend returns: { status, message, data: { user, token } }
      if (response.data.data && typeof response.data.data === 'object') {
        const responseData = response.data.data;

        // Extract user and token (handle both property orders)
        userData = responseData.user;
        token = responseData.token;

        // If not found, try destructuring
        if (!token || !userData) {
          ({ token, user: userData } = responseData);
        }
      } else if (response.data.token && response.data.user) {
        // Direct structure: { token, user }
        token = response.data.token;
        userData = response.data.user;
      } else {
        throw new Error('Invalid response structure from server');
      }

      console.log('✅ Token:', token ? '✓ Present' : '✗ Missing');
      console.log('👤 User data:', userData);
      console.log('🏢 Branch ID:', userData?.branchId);

      if (!token || !userData) {
        throw new Error('Missing token or user data in response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Store branchId if present (for managers)
      if (userData.branchId) {
        localStorage.setItem('branchId', userData.branchId.toString());
        console.log('✅ Stored branchId:', userData.branchId);
      }

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.error('❌ Error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
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