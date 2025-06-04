import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
    Paper,
    useTheme,
    CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { validateName, validateEmail } from '../utils/validation';
import { styled } from '@mui/material/styles';
import { colors } from '../theme/theme';
import { Pets } from '@mui/icons-material';

const GlassPaper = styled(Paper)(({ theme }) => ({
    background: colors.custom.glassBg,
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    border: `1px solid ${colors.custom.cardBorder}`,
    padding: theme.spacing(4),
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(5px)',
        borderRadius: '12px',
        '& fieldset': {
            borderColor: 'rgba(255, 112, 67, 0.2)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 112, 67, 0.5)',
        },
        '&.Mui-focused fieldset': {
            borderColor: colors.primary.main,
        },
    },
    '& .MuiInputLabel-root': {
        color: colors.text.primary,
    },
    '& .MuiInputBase-input': {
        color: colors.text.primary,
    },
    '& .MuiFormHelperText-root': {
        color: colors.text.secondary,
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(45deg, ${colors.primary.main} 30%, ${colors.primary.light} 90%)`,
    border: 0,
    borderRadius: '12px',
    boxShadow: '0 3px 5px 2px rgba(255, 112, 67, 0.2)',
    color: 'white',
    height: 56,
    padding: '0 30px',
    fontWeight: 600,
    fontSize: '1.1rem',
    '&:hover': {
        background: `linear-gradient(45deg, ${colors.primary.light} 30%, ${colors.primary.main} 90%)`,
        boxShadow: '0 4px 10px rgba(255, 112, 67, 0.3)',
    },
}));

const Login: React.FC = () => {
    const { login } = useAuth();
    const theme = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        submit: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({ name: '', email: '', submit: '' });
        setIsLoading(true);

        let hasError = false;
        if (!validateName(name)) {
            setErrors(prev => ({
                ...prev,
                name: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)',
            }));
            hasError = true;
        }
        if (!validateEmail(email)) {
            setErrors(prev => ({
                ...prev,
                email: 'Please enter a valid email address',
            }));
            hasError = true;
        }

        if (!hasError) {
            try {
                await login({ name, email });
            } catch (error) {
                console.error('Login error:', error);
                setErrors(prev => ({
                    ...prev,
                    submit: error instanceof Error ? error.message : 'Login failed. Please try again.',
                }));
            }
        }
        setIsLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: colors.background.gradient,
                py: 3,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url(/paw-pattern.svg) repeat',
                    opacity: 0.1,
                    zIndex: 0,
                },
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <GlassPaper elevation={0}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                        <Pets sx={{ fontSize: 40, color: colors.primary.main, mr: 2 }} />
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                color: colors.text.primary,
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                            }}
                        >
                            Find Your Perfect Dog
                        </Typography>
                    </Box>

                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            mb: 4,
                            color: colors.text.secondary,
                        }}
                    >
                        Enter your details to start discovering adorable dogs waiting for their forever home
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <StyledTextField
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            margin="normal"
                            disabled={isLoading}
                        />
                        <StyledTextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            margin="normal"
                            disabled={isLoading}
                        />

                        {errors.submit && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mt: 2,
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(216, 67, 21, 0.1)',
                                    color: colors.error.dark,
                                }}
                            >
                                {errors.submit}
                            </Alert>
                        )}

                        <StyledButton
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                            sx={{ mt: 4 }}
                        >
                            {isLoading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CircularProgress size={20} color="inherit" />
                                    <span>Logging in...</span>
                                </Box>
                            ) : (
                                'Start Finding Dogs'
                            )}
                        </StyledButton>
                    </form>
                </GlassPaper>
            </Container>
        </Box>
    );
};

export default Login; 