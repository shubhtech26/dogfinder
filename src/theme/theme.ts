import { createTheme } from '@mui/material/styles';

// Custom color palette
const colors = {
    primary: {
        main: '#FF7043', // Deep Orange
        light: '#FF8A65',
        dark: '#F4511E',
    },
    secondary: {
        main: '#FFD180', // Light Amber
        light: '#FFE0B2',
        dark: '#FFB74D',
    },
    background: {
        default: '#FFF8E1', // Cream
        paper: '#FFFFFF',
        gradient: 'linear-gradient(135deg, #FF7043 0%, #FFD180 100%)',
        card: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
        primary: '#4E342E', // Dark brown
        secondary: '#795548', // Medium brown
        light: '#FFFFFF',
    },
    error: {
        main: '#D84315',
        light: '#FF8A65',
        dark: '#BF360C',
    },
    success: {
        main: '#66BB6A',
        light: '#81C784',
        dark: '#4CAF50',
    },
    custom: {
        pawPrint: '#FF8A65',
        cardBorder: 'rgba(244, 81, 30, 0.1)',
        glassBg: 'rgba(255, 246, 225, 0.85)',
    },
};

const theme = createTheme({
    palette: {
        primary: colors.primary,
        secondary: colors.secondary,
        error: colors.error,
        success: colors.success,
        background: colors.background,
        text: colors.text,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            color: colors.text.primary,
        },
        h2: {
            fontWeight: 700,
            color: colors.text.primary,
        },
        h3: {
            fontWeight: 600,
            color: colors.text.primary,
        },
        h4: {
            fontWeight: 600,
            color: colors.text.primary,
        },
        h5: {
            fontWeight: 600,
            color: colors.text.primary,
        },
        h6: {
            fontWeight: 600,
            color: colors.text.primary,
        },
        body1: {
            color: colors.text.primary,
        },
        body2: {
            color: colors.text.secondary,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(255, 112, 67, 0.2)',
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
                    '&:hover': {
                        background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
                    },
                },
                containedSecondary: {
                    background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
                    color: colors.text.primary,
                    '&:hover': {
                        background: `linear-gradient(135deg, ${colors.secondary.light} 0%, ${colors.secondary.main} 100%)`,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    border: `1px solid ${colors.custom.cardBorder}`,
                    background: colors.background.card,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    backgroundColor: colors.secondary.light,
                    color: colors.text.primary,
                    '&:hover': {
                        backgroundColor: colors.secondary.main,
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                },
                standardError: {
                    backgroundColor: 'rgba(216, 67, 21, 0.1)',
                    color: colors.error.dark,
                },
                standardSuccess: {
                    backgroundColor: 'rgba(102, 187, 106, 0.1)',
                    color: colors.success.dark,
                },
            },
        },
    },
});

export { theme, colors }; 