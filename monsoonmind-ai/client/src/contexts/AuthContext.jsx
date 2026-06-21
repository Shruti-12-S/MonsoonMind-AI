import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updateMe
} from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("monsoonmind_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem("monsoonmind_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (payload) => {
    const data = await loginUser(payload);
    localStorage.setItem("monsoonmind_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    localStorage.setItem("monsoonmind_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser().catch(() => null);
    localStorage.removeItem("monsoonmind_token");
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const updated = await updateMe(payload);
    setUser(updated);
    return updated;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateProfile
    }),
    [loading, login, logout, register, updateProfile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
};
