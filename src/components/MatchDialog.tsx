import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Dog } from '../types';
import Confetti from 'react-confetti';

interface MatchDialogProps {
    open: boolean;
    onClose: () => void;
    matchedDog: Dog | null;
}

const MatchDialog: React.FC<MatchDialogProps> = ({ open, onClose, matchedDog }) => {
    const theme = useTheme();

    if (!matchedDog) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden'
                }
            }}
        >
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={true}
                numberOfPieces={200}
            />
            
            <DialogTitle sx={{ 
                m: 0, 
                p: 2, 
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                color: 'white'
            }}>
                <Typography variant="h4" component="div" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    🎉 It's a Match! 🎉
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white'
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    alignItems: 'center'
                }}>
                    <Card sx={{ 
                        maxWidth: 400,
                        width: '100%',
                        boxShadow: theme.shadows[10],
                        transform: 'rotate(-3deg)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'rotate(0deg) scale(1.02)'
                        }
                    }}>
                        <CardMedia
                            component="img"
                            height="400"
                            image={matchedDog.img}
                            alt={matchedDog.name}
                            sx={{ objectFit: 'cover' }}
                        />
                    </Card>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h3" component="div" color="primary" gutterBottom>
                            {matchedDog.name}
                        </Typography>
                        <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.secondary }}>
                            Your perfect companion awaits!
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Breed: {matchedDog.breed}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Age: {matchedDog.age} years
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Location: {matchedDog.zip_code}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default MatchDialog; 