import React from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Typography,
    Slider,
    Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { validateZipCode } from '../utils/validation';
import { SearchFilters as SearchFiltersType } from '../types';
import { colors } from '../theme/theme';
import MatchButton from './MatchButton';

const GlassBox = styled(Box)(({ theme }) => ({
    background: colors.custom.glassBg,
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    border: `1px solid ${colors.custom.cardBorder}`,
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
}));

const FiltersContainer = styled(Box)({ flexGrow: 1, overflowY: 'auto' });

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    '& .MuiInputLabel-root': {
        color: colors.text.secondary,
        transformOrigin: 'left top',
        '&.Mui-focused': {
            color: colors.primary.main,
        },
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(10px, -5px) scale(0.85)',
    },
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        color: colors.text.primary,
        '& fieldset': {
            borderColor: 'rgba(255, 112, 67, 0.3)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 112, 67, 0.6)',
        },
        '&.Mui-focused fieldset': {
            borderColor: colors.primary.main,
            borderWidth: '1px',
        },
    },
    '& .MuiInputBase-input': {
        color: colors.text.primary,
    },
    '& .MuiSelect-icon': {
        color: colors.text.secondary,
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    border: 0,
    borderRadius: '12px',
    boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
    color: colors.text.light,
    minHeight: '48px',
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: '0.95rem',
    textTransform: 'none',
    transition: 'background 0.3s ease, box-shadow 0.3s ease',
}));

const ClearFiltersButton = styled(ActionButton)(({ theme }) => ({
    background: `linear-gradient(45deg, ${colors.secondary.light} 30%, ${colors.secondary.main} 90%)`,
    color: colors.text.primary,
    padding: '0 16px',
    height: '40px',
    minHeight: '40px',
    fontSize: '0.875rem',
    '&:hover': {
        background: `linear-gradient(45deg, ${colors.secondary.main} 30%, ${colors.secondary.light} 90%)`,
        boxShadow: `0 3px 8px rgba(0, 0, 0, 0.15)`,
    },
}));

const ClearFavoriteStyledButton = styled(ActionButton)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)`,
    color: colors.text.light,
    '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
        boxShadow: `0 3px 8px ${theme.palette.error.dark}4D`,
    },
}));

interface Props {
    filters: SearchFiltersType;
    breeds: string[];
    onFiltersChange: (filters: Partial<SearchFiltersType>) => void;
    onClearAllFilters: () => void;
    isLoading?: boolean;
    favoriteCount: number;
    onGenerateMatch: () => Promise<void>;
    onClearFavorite: () => void;
    isGeneratingMatch: boolean;
}

const SearchFilters: React.FC<Props> = ({
    filters,
    breeds,
    onFiltersChange,
    onClearAllFilters,
    isLoading,
    favoriteCount,
    onGenerateMatch,
    onClearFavorite,
    isGeneratingMatch,
}) => {
    const [zipError, setZipError] = React.useState('');

    const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value && !validateZipCode(value)) {
            setZipError('Valid 5-digit ZIP code, please!');
        } else {
            setZipError('');
        }
        onFiltersChange({ zipCodes: value ? [value] : undefined });
    };

    const handleFilterChange = <K extends keyof SearchFiltersType>(key: K, value: SearchFiltersType[K]) => {
        onFiltersChange({ [key]: value });
    };

    const handleAgeRangeChange = (event: Event, newValue: number | number[]) => {
        const [min, max] = newValue as number[];
        onFiltersChange({ ageMin: min, ageMax: max });
    };

    return (
        <GlassBox>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 0.5 }}>
                <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 'bold' }}>
                    Search Filters
                </Typography>
                <ClearFiltersButton
                    startIcon={<ClearIcon fontSize="small" />}
                    onClick={onClearAllFilters}
                    disabled={isLoading || isGeneratingMatch}
                >
                    Clear Filters
                </ClearFiltersButton>
            </Box>

            <FiltersContainer sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pr: 0.5, mr: -0.5 }}>
                <StyledFormControl fullWidth variant="outlined">
                    <TextField
                        label="ZIP Code"
                        value={filters.zipCodes?.[0] || ''}
                        onChange={handleZipCodeChange}
                        error={!!zipError}
                        helperText={zipError}
                        disabled={isLoading || isGeneratingMatch}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: colors.text.secondary, mr: 1 }} />,
                        }}
                        sx={{ '& .MuiFormHelperText-root': { color: colors.error.main } }}
                    />
                </StyledFormControl>

                <StyledFormControl fullWidth variant="outlined">
                    <InputLabel id="breeds-label">Breeds</InputLabel>
                    <Select
                        labelId="breeds-label"
                        label="Breeds"
                        multiple
                        value={filters.breeds || []}
                        disabled={isLoading || isGeneratingMatch}
                        onChange={(e) => handleFilterChange('breeds', e.target.value as string[])}
                        renderValue={(selected: string[]) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" sx={{ backgroundColor: colors.secondary.light, color: colors.text.primary, fontWeight: 500 }} />
                                ))}
                            </Box>
                        )}
                    >
                        {breeds.map((breed) => ( <MenuItem key={breed} value={breed}> {breed} </MenuItem> ))}
                    </Select>
                </StyledFormControl>

                <Box sx={{ px: 1, mt: 0.5 }}>
                    <Typography sx={{ color: colors.text.secondary, mb: 0.5, fontSize: '0.875rem' }}>Age Range</Typography>
                    <Slider
                        value={[filters.ageMin || 0, filters.ageMax || 20]}
                        onChange={handleAgeRangeChange}
                        valueLabelDisplay="auto" min={0} max={20}
                        disabled={isLoading || isGeneratingMatch}
                        sx={{ color: colors.primary.main, '& .MuiSlider-thumb': { backgroundColor: colors.primary.main }, '& .MuiSlider-valueLabel': { backgroundColor: colors.primary.dark } }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}> {filters.ageMin} years </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}> {filters.ageMax} years </Typography>
                    </Box>
                </Box>

                <StyledFormControl fullWidth variant="outlined">
                    <InputLabel id="sort-label">Sort</InputLabel>
                    <Select
                        labelId="sort-label"
                        label="Sort"
                        value={filters.sort || 'breed:asc'}
                        disabled={isLoading || isGeneratingMatch}
                        onChange={(e) => handleFilterChange('sort', e.target.value as string)}
                    >
                        <MenuItem value="breed:asc">Breed (A-Z)</MenuItem>
                        <MenuItem value="breed:desc">Breed (Z-A)</MenuItem>
                        <MenuItem value="name:asc">Name (A-Z)</MenuItem>
                        <MenuItem value="name:desc">Name (Z-A)</MenuItem>
                        <MenuItem value="age:asc">Age (Youngest)</MenuItem>
                        <MenuItem value="age:desc">Age (Oldest)</MenuItem>
                    </Select>
                </StyledFormControl>
            </FiltersContainer>
            
            <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <MatchButton 
                    favoriteCount={favoriteCount} 
                    isLoading={isGeneratingMatch} 
                    onClick={onGenerateMatch} 
                />
                {favoriteCount > 0 && (
                    <ClearFavoriteStyledButton
                        onClick={onClearFavorite}
                        startIcon={<ClearIcon />}
                        fullWidth
                        disabled={isGeneratingMatch}
                    >
                        Clear Favorite
                    </ClearFavoriteStyledButton>
                )}
            </Box>
        </GlassBox>
    );
};

export default SearchFilters; 