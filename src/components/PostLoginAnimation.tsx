import React, { useEffect } from 'react';
import { Box, Typography, keyframes, styled } from '@mui/material';
import { Pets as DogIcon, Person as ManIcon } from '@mui/icons-material'; // Placeholder icons
import { colors } from '../theme/theme'; // Assuming theme colors are exported

const dogRunAnimation = keyframes`
  0% { transform: translateX(-150px); opacity: 0; } /* Start off-screen left */
  50% { opacity: 1; }
  100% { transform: translateX(0px); opacity: 1; } /* End at its defined position */
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0px); }
`;

const AnimationContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    background: colors.background.default, // Changed from colors.background.gradient
    zIndex: 2000, // High z-index
    overflow: 'hidden', // Prevent scrollbars if content is too large during animation
});

const SceneBox = styled(Box)({
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center', // This will center the ManElement if DogElement is positioned absolutely
    position: 'relative',
    height: '120px', // Increased height for icons
    width: '350px',  // Wider scene
    marginBottom: '30px',
});

// Dog starts to the left of the man and runs towards him.
// Man is somewhat centered. Dog moves relative to the SceneBox.
const DogElement = styled(Box)({
    position: 'absolute', // Positioned within SceneBox
    left: '0%', // Start from the left edge of SceneBox
    bottom: '0px', // Align with bottom
    animation: `${dogRunAnimation} 2.0s ease-out forwards`,
    color: colors.primary.main,
    opacity: 0, // Start with opacity 0, animation will make it visible
    '& .MuiSvgIcon-root': {
        fontSize: '70px', // Larger icon
    }
});

const ManElement = styled(Box)({
    position: 'absolute', // Positioned within SceneBox
    right: '0%', // End at the right edge of SceneBox
    bottom: '0px', // Align with bottom
    color: colors.secondary.dark,
    '& .MuiSvgIcon-root': {
        fontSize: '80px', // Slightly larger icon for man
    }
});

const TaglineText = styled(Typography)(({ theme }) => ({
    opacity: 0,
    animation: `${fadeIn} 1.5s ease-in forwards`,
    animationDelay: '1.8s', // Start after dog animation is mostly done
    color: colors.text.primary, // Changed from colors.text.light
    fontWeight: 600,
    marginTop: theme.spacing(3),
    textAlign: 'center',
    padding: theme.spacing(0, 2), // Add some padding for smaller screens
}));

interface PostLoginAnimationProps {
    onAnimationComplete: () => void;
    tagline?: string;
}

const PostLoginAnimation: React.FC<PostLoginAnimationProps> = ({
    onAnimationComplete,
    tagline = "Fetching your perfect match...", // New tagline
}) => {
    useEffect(() => {
        // Total animation duration:
        // Dog animation: 2.0s
        // Tagline fade-in starts at 1.8s, lasts 1.5s. Ends at 3.3s.
        // Add a small buffer.
        const totalAnimationTime = 3800; // milliseconds

        const timer = setTimeout(() => {
            onAnimationComplete();
        }, totalAnimationTime);

        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    return (
        <AnimationContainer>
            <SceneBox>
                {/* Man is static on the right */}
                <ManElement>
                    <ManIcon />
                </ManElement>
                {/* Dog animates from left to the man's presumed position (center-ish) */}
                <DogElement>
                    <DogIcon />
                </DogElement>
            </SceneBox>
            <TaglineText variant="h4">
                {tagline}
            </TaglineText>
        </AnimationContainer>
    );
};

export default PostLoginAnimation; 