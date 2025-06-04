import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Search from './pages/Search';
import { useAuth } from './context/AuthContext';
import { theme, colors } from './theme/theme';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1
        },
    },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoadingSession } = useAuth();

    if (isLoadingSession) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh', 
                    bgcolor: colors.background.default 
                }}
            >
                <CircularProgress sx={{ color: colors.primary.main }} size={60} />
            </Box>
        );
    }
    return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <AuthProvider>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route
                                path="/search"
                                element={
                                    <ProtectedRoute>
                                        <Search />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AuthProvider>
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App; 