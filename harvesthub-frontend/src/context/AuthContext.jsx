import {
  createContext,
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

export const AuthContext = createContext(null);

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

const persistAuth = (data) => {
  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  if (data?.user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(data.user)
    );
  }
};

const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [farmerProfile, setFarmerProfile] =
    useState(null);
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
      setLoading(false);
      return null;
    }

    try {
      const response = await getMe();

      const userData = response.data?.user;
      const profileData = response.data?.farmerProfile;

      setUser(userData || null);
      setFarmerProfile(profileData || null);

      if (userData) {
        localStorage.setItem(
          USER_KEY,
          JSON.stringify(userData)
        );
      }

      return response.data;
    } catch (error) {
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser().catch(() => {
      setLoading(false);
    });
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
      const response = await loginRequest(credentials);
      const data = response.data;

      persistAuth(data);

      setUser(data.user || null);
      setFarmerProfile(data.farmerProfile || null);

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
      const response = await registerFarmer(payload);
      const data = response.data;

      persistAuth(data);

      setUser(data.user || null);
      setFarmerProfile(data.farmerProfile || null);

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