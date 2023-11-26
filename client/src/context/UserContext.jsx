import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('bookAPIToken');
      if (storedUser) {
        const decoded = jwtDecode(storedUser);
        setCurrentUser(decoded);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Token decoding error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('bookAPIToken');
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, loading, setLoading, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider!');
  }

  return context;
};
