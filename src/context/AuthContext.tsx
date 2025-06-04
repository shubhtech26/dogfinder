import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginCredentials } from '../types';
import { login as apiLogin, logout as apiLogout } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    user: LoginCredentials | null;
    isLoadingSession: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to validate session with the server
const validateSession = async (): Promise<boolean> => {
    try {
        // Make a request to any protected endpoint to validate session
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
            credentials: 'include',
        });
        return response.ok;
    } catch (error) {
        console.error('Session validation failed:', error);
        return false;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<LoginCredentials | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            if (!isMounted) return;
            setIsLoadingSession(true);
            const isValid = await validateSession();

            if (isMounted) {
                setIsAuthenticated(isValid);
                if (isValid) {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        try {
                            setUser(JSON.parse(storedUser));
                        } catch (e) {
                            localStorage.removeItem('user');
                            setUser(null);
                        }
                    }
                } else {
                    setUser(null);
                    localStorage.removeItem('user');
                }
                setIsLoadingSession(false);
            }
        };

        checkSession();

        const intervalId = setInterval(async () => {
            const isValid = await validateSession();
            if (isMounted && !isValid && isAuthenticated) {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('favorites');
                localStorage.removeItem('searchFilters');
                localStorage.removeItem('currentPage');
                if (window.location.pathname !== '/') {
                    navigate('/');
                }
            } else if (isMounted && isValid && !isAuthenticated) {
                setIsAuthenticated(true);
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try { setUser(JSON.parse(storedUser)); } catch (e) { localStorage.removeItem('user'); setUser(null); }
                }
            }
        }, 5 * 60 * 1000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [navigate]);

    const login = async (credentials: LoginCredentials) => {
        try {
            await apiLogin(credentials);
            setIsAuthenticated(true);
            setUser(credentials);
            localStorage.setItem('user', JSON.stringify(credentials));
            navigate('/search');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('API Logout failed, proceeding with client logout:', error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('favorites');
            localStorage.removeItem('searchFilters');
            localStorage.removeItem('currentPage');
            navigate('/');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoadingSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 