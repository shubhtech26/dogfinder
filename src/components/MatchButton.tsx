import React from 'react';
import { Button, Box, CircularProgress, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Pets } from '@mui/icons-material';
import { colors } from '../theme/theme';

const pulse = keyframes`
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 ${colors.primary.light}AA; /* AA for opacity */
    }
    70% {
        transform: scale(1.03);
        box-shadow: 0 0 0 10px ${colors.primary.light}00; /* 00 for transparent */
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 ${colors.primary.light}00;
    }
`;

const StyledMatchButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(45deg, ${colors.primary.main} 30%, ${colors.primary.light} 90%)`,
    border: 0,
    borderRadius: '16px',
    boxShadow: `0 3px 5px 2px ${colors.primary.dark}4D`, // 4D for opacity ~0.3
    color: colors.text.light,
    padding: '10px 24px', // Adjusted padding for single icon
    minHeight: '48px', // Ensure consistent height
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.3s ease, box-shadow 0.3s ease',
    textTransform: 'none', // Ensure text case is as intended
    fontSize: '0.95rem', // Slightly adjust font size if needed
    fontWeight: 600,
    '&:hover': {
        background: `linear-gradient(45deg, ${colors.primary.light} 30%, ${colors.primary.main} 90%)`,
        boxShadow: `0 4px 8px 3px ${colors.primary.dark}66`, // 66 for opacity ~0.4
    },
    '&.active': {
        animation: `${pulse} 2s infinite`,
    },
    '&.Mui-disabled': {
        background: 'rgba(0,0,0,0.12)',
        color: 'rgba(0,0,0,0.26)',
        boxShadow: 'none',
        animation: 'none', // Stop animation when disabled
    },
    '& .MuiButton-startIcon': {
        marginRight: '6px', // Adjust spacing if icon is solo
    },
}));

interface Props {
    favoriteCount: number;
    isLoading: boolean;
    onClick: () => void;
}

const MatchButton: React.FC<Props> = ({ favoriteCount, isLoading, onClick }) => {
    const isActive = favoriteCount > 0;

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <StyledMatchButton
                onClick={onClick}
                disabled={!isActive || isLoading}
                className={isActive && !isLoading ? 'active' : ''}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Pets />}
                fullWidth // Make button take full width of its container in SearchFilters
            >
                {isLoading ? 'Revealing...' : 'Reveal My Match!'}
            </StyledMatchButton>
        </Box>
    );
};

export default MatchButton; 