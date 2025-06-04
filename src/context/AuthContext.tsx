import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginCredentials } from '../types';
import { login as apiLogin, logout as apiLogout } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    user: LoginCredentials | null;
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
    const navigate = useNavigate();

    // Validate session on mount and set up periodic check
    useEffect(() => {
        const checkSession = async () => {
            const isValid = await validateSession();
            
            // If session is invalid but we think we're authenticated
            if (!isValid && isAuthenticated) {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('user');
                navigate('/');
            }
            
            // If session is valid but we think we're not authenticated
            if (isValid && !isAuthenticated) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                }
            }
        };

        checkSession();

        // Check session every 5 minutes
        const intervalId = setInterval(checkSession, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [isAuthenticated, navigate]);

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
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('favorites');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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