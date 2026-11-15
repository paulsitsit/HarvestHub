import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  getMe,
  login as loginRequest,
  registerFarmer
} from '../api/authApi.js';

import { getApiErrorMessage } from '../api/axiosInstance.js';
import { AuthContext } from './AuthContextValue.js';

const TOKEN_KEY = 'harvesthub_token';
const USER_KEY = 'harvesthub_user';

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const normalizeAuthData = (data) => {
  const authData = data?.data || data || {};

  return {
    token: authData.token || null,
    user: authData.user || null,
    farmerProfile: authData.farmerProfile || null
  };
};

const persistAuth = (data) => {
  const authData = normalizeAuthData(data);

  if (authData.token) {
    localStorage.setItem(
      TOKEN_KEY,
      authData.token
    );
  }

  if (authData.user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(authData.user)
    );
  }
};

const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const logout = useCallback(() => {
    clearAuthStorage();

    setUser(null);
    setFarmerProfile(null);
    setAuthError('');
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setFarmerProfile(null);
      setLoading(false);

      return null;
    }

    try {
      const responseData = await getMe();
      const data = normalizeAuthData(responseData);

      if (!data.user) {
        logout();
        return null;
      }

      setUser(data.user);
      setFarmerProfile(data.farmerProfile);

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(data.user)
      );

      return data;
    } catch (error) {
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    Promise.resolve().then(() =>
      refreshUser().catch(() => {
        setLoading(false);
      })
    );
  }, [refreshUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(
      'harvesthub:unauthorized',
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        'harvesthub:unauthorized',
        handleUnauthorized
      );
    };
  }, [logout]);

  const login = useCallback(async (credentials) => {
    setAuthError('');

    try {
      const responseData = await loginRequest(
        credentials
      );

      const data = normalizeAuthData(responseData);

      if (!data.token || !data.user) {
        throw new Error(
          'Login response did not include a token and user'
        );
      }

      persistAuth(data);

      setUser(data.user);
      setFarmerProfile(data.farmerProfile);

      return data;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Unable to log in'
      );

      setAuthError(message);
      throw error;
    }
  }, []);

  const register = useCallback(async (payload) => {
    setAuthError('');

    try {
      const responseData = await registerFarmer(
        payload
      );

      const data = normalizeAuthData(responseData);

      if (data.token) {
        persistAuth(data);
      }

      setUser(data.user);
      setFarmerProfile(data.farmerProfile);

      return data;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Unable to register'
      );

      setAuthError(message);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      farmerProfile,
      loading,
      authError,
      isAuthenticated: Boolean(user),
      isFarmer: user?.role === 'farmer',
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      refreshUser
    }),
    [
      user,
      farmerProfile,
      loading,
      authError,
      login,
      register,
      logout,
      refreshUser
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};