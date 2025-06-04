import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import MatchButton from './MatchButton';
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

interface Props {
    favoriteCount: number;
    onGenerateMatch: () => Promise<void>; // Ensure this is a promise for async handling
}

const Header: React.FC<Props> = ({ favoriteCount, onGenerateMatch }) => {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const [isMatchLoading, setIsMatchLoading] = React.useState(false);

    const handleGenerateMatch = async () => {
        setIsMatchLoading(true);
        try {
            await onGenerateMatch();
        } catch (error) {
            console.error("Error generating match from header:", error);
            // Optionally, show an error to the user here
        } finally {
            setIsMatchLoading(false);
        }
    };

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
                        DoggyMatch
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

                    <MatchButton
                        favoriteCount={favoriteCount}
                        isLoading={isMatchLoading} // Use the specific loading state for the match button
                        onClick={handleGenerateMatch}
                    />

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