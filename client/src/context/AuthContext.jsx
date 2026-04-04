import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('rai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
    localStorage.setItem('rai_token', data.token);
    setToken(data.token);
    setUser(data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/api/auth/register`, { name, email, password });
    localStorage.setItem('rai_token', data.token);
    setToken(data.token);
    setUser(data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('rai_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const stored = localStorage.getItem('rai_token');
    if (stored) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
      axios.get(`${API}/api/users/profile`)
        .then(({ data }) => setUser(data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
