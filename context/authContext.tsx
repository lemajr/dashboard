'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: string | null;
  login: (formData: LoginForm) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface LoginForm {
  username: string;
  password: string;
}

interface DecodedToken {
  exp: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  
  // Function to handle session refresh
  const refreshSession = async () => {

    // Get the current access token from cookies
  const currentAccessToken = Cookies.get('access_token');

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/token/refresh', {}, {
        headers: {
          Authorization: `Bearer ${currentAccessToken}`, // Set the Authorization header with the current token
        },
        withCredentials: true
      }
      )

      const newToken = response.data.access_token;
      // console.log(response.data); // New token

      Cookies.set('access_token', newToken, { expires: 1, secure: true, sameSite: 'strict' });
      setUser(newToken); // Update user state with new token
    } catch (error) {
      // console.error('Token refresh error:', error);
      logout(); // Log out if token refresh fails
    }
  };

  // Handle logout
  const logout = () => {
    Cookies.remove('access_token'); // Remove token cookie
    setUser(null);
    router.push('/login');
  };

  // Unified effect for token expiration and session management
  useEffect(() => {
    const handleTokenExpiration = () => {
      const token = Cookies.get('access_token');
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = decodedToken.exp - currentTime;

        if (timeLeft <= 120) {
          const stayLoggedIn = window.confirm('Your session is about to expire. Do you want to stay logged in?');
          if (stayLoggedIn) {
            refreshSession(); // Extend session if the user confirms
          } else {
            logout(); // Log out if user doesn't want to stay logged in
          }
        }
      }
    };

    const token = Cookies.get('access_token');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp > currentTime) {
        setUser(token); // Token is valid, set user
      } else {
        logout(); // Token expired, log out
      }
    }
    setLoading(false);

    // Set up interval for checking token expiration every minute
    const interval = setInterval(() => {
      handleTokenExpiration();
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

// Handle login
const login = async (formData: LoginForm) => {
  try {
    const response = await axios.post('/api/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    });
    const token = response.data.access_token;
    Cookies.set('access_token', token, { expires: 1, secure: true, sameSite: 'strict' });
    setUser(token);
    router.push('/dashboard');
  } catch (err) {
    // Handle errors coming from the /api/login route
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized: Invalid credentials. Please try again.');
      } else {
        throw new Error(`Login failed: ${err.response.data.detail || 'Please try again later.'}`);
      }
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};



  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError, loading }}>
      {!loading && children} {/* Only render children once loading is complete */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
