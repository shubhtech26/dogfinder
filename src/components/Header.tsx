import React from 'react';
import { AppBar, Box, Toolbar, Button, useTheme, Badge } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface HeaderProps {
    favoriteCount?: number;
    onGenerateMatch?: () => void;
}

const Header: React.FC<HeaderProps> = ({ favoriteCount = 0, onGenerateMatch }) => {
    const { logout } = useAuth();
    const theme = useTheme();

    return (
        <AppBar 
            position="fixed" 
            color="default" 
            elevation={1}
            sx={{ 
                backgroundColor: 'white',
                borderBottom: `1px solid ${theme.palette.divider}`,
                zIndex: theme.zIndex.drawer + 1
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                        src="/fetch-logo-promo.gif" 
                        alt="Fetch Logo" 
                        style={{ 
                            height: '50px',
                            marginRight: theme.spacing(2)
                        }} 
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        color="primary"
                        onClick={onGenerateMatch}
                        startIcon={
                            <Badge badgeContent={favoriteCount} color="error">
                                <FavoriteIcon />
                            </Badge>
                        }
                        variant="contained"
                        disabled={favoriteCount === 0}
                    >
                        Generate Match
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => logout()}
                        startIcon={<LogoutIcon />}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 