import React from 'react';
import { Button, Box, CircularProgress, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Favorite, Pets } from '@mui/icons-material';
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
    padding: '10px 20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.3s ease, box-shadow 0.3s ease',
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
    },
}));

const IconWrapper = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});

interface Props {
    favoriteCount: number;
    isLoading: boolean;
    onClick: () => void;
}

const MatchButton: React.FC<Props> = ({ favoriteCount, isLoading, onClick }) => {
    const isActive = favoriteCount > 0;

    return (
        <Box sx={{ position: 'relative' }}>
            <StyledMatchButton
                onClick={onClick}
                disabled={!isActive || isLoading}
                className={isActive && !isLoading ? 'active' : ''}
                startIcon={
                    <IconWrapper>
                        {isLoading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <>
                                <Favorite sx={{ color: isActive ? colors.text.light : undefined }} />
                                <Pets sx={{ color: isActive ? colors.text.light : undefined }} />
                            </>
                        )}
                    </IconWrapper>
                }
            >
                {isLoading ? (
                    'Finding Match...'
                ) : (
                    <>
                        Generate Match
                        {favoriteCount > 0 && (
                            <Typography
                                component="span"
                                sx={{
                                    ml: 1,
                                    background: 'rgba(255, 255, 255, 0.25)',
                                    borderRadius: '12px',
                                    padding: '2px 8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: colors.text.light,
                                }}
                            >
                                {favoriteCount}
                            </Typography>
                        )}
                    </>
                )}
            </StyledMatchButton>
        </Box>
    );
};

export default MatchButton; 