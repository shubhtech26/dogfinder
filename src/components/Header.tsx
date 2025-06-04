import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';
import { Pets } from '@mui/icons-material';

const GlassAppBar = styled(AppBar)(({ theme }) => ({
    background: 'rgba(255, 248, 225, 0.7)', // Light cream with opacity
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${colors.primary.light}4D`, // Primary light with opacity
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 24px',
});

// Props are no longer needed as MatchButton is removed
// interface Props {
//     favoriteCount: number;
//     onGenerateMatch: () => Promise<void>; 
// }

const Header: React.FC = () => { // Removed Props
    const { user, logout } = useAuth();
    const theme = useTheme();
    // Removed isMatchLoading and handleGenerateMatchInternal as MatchButton is moved

    return (
        <GlassAppBar position="fixed">
            <StyledToolbar>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Pets sx={{ color: colors.primary.main, mr: 1.5, fontSize: '28px' }} />
                    <Typography
                        variant="h6"
                        sx={{
                            color: colors.text.primary,
                            fontWeight: 'bold',
                            letterSpacing: '0.5px',
                        }}
                    >
                        FetchMate
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 3 } }}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: colors.text.secondary,
                            display: { xs: 'none', sm: 'block' } 
                        }}
                    >
                        Welcome, {user?.name}!
                    </Typography>

                    {/* MatchButton and its related logic removed from here */}

                    <Typography
                        onClick={logout}
                        sx={{
                            color: colors.text.secondary,
                            cursor: 'pointer',
                            fontWeight: 500,
                            '&:hover': {
                                color: colors.primary.main,
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Logout
                    </Typography>
                </Box>
            </StyledToolbar>
        </GlassAppBar>
    );
};

export default Header; 