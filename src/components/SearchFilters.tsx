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

const GlassBox = styled(Box)(({ theme }) => ({
    background: colors.custom.glassBg,
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    border: `1px solid ${colors.custom.cardBorder}`,
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255, 255, 255, 0.7)',
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
        color: colors.text.secondary,
        '&.Mui-focused': {
            color: colors.primary.main,
        },
    },
    '& .MuiInputBase-input': {
        color: colors.text.primary,
    },
    '& .MuiSelect-icon': {
        color: colors.text.secondary,
    },
}));

const ClearButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(45deg, ${colors.secondary.light} 30%, ${colors.secondary.main} 90%)`,
    border: 0,
    borderRadius: '12px',
    boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
    color: colors.text.primary,
    height: 40,
    padding: '0 20px',
    '&:hover': {
        background: `linear-gradient(45deg, ${colors.secondary.main} 30%, ${colors.secondary.light} 90%)`,
        boxShadow: `0 3px 8px rgba(0, 0, 0, 0.15)`,
    },
}));

interface Props {
    filters: SearchFiltersType;
    breeds: string[];
    onFiltersChange: (filters: SearchFiltersType) => void;
    onClear: () => void;
    isLoading?: boolean;
}

const SearchFilters: React.FC<Props> = ({
    filters,
    breeds,
    onFiltersChange,
    onClear,
    isLoading
}) => {
    const [zipError, setZipError] = React.useState('');

    const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value && !validateZipCode(value)) {
            setZipError('Please enter a valid 5-digit ZIP code');
        } else {
            setZipError('');
            onFiltersChange({
                ...filters,
                zipCodes: value ? [value] : undefined,
            });
        }
    };

    const handleFilterChange = <K extends keyof SearchFiltersType>(key: K, value: SearchFiltersType[K]) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const handleAgeRangeChange = (event: Event, newValue: number | number[]) => {
        const [min, max] = newValue as number[];
        onFiltersChange({
            ...filters,
            ageMin: min,
            ageMax: max,
        });
    };

    return (
        <GlassBox>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 'bold' }}>
                    Search Filters
                </Typography>
                <ClearButton
                    startIcon={<ClearIcon />}
                    onClick={onClear}
                    size="small"
                    disabled={isLoading}
                >
                    Clear All
                </ClearButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <StyledFormControl fullWidth variant="outlined">
                    <TextField
                        label="ZIP Code"
                        value={filters.zipCodes?.[0] || ''}
                        onChange={handleZipCodeChange}
                        error={!!zipError}
                        helperText={zipError}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: colors.text.secondary, mr: 1 }} />,
                        }}
                        sx={{
                            '& .MuiFormHelperText-root': { color: colors.error.main },
                        }}
                    />
                </StyledFormControl>

                <StyledFormControl fullWidth variant="outlined">
                    <InputLabel>Breeds</InputLabel>
                    <Select
                        multiple
                        value={filters.breeds || []}
                        disabled={isLoading}
                        onChange={(e) => handleFilterChange('breeds', e.target.value as string[])}
                        renderValue={(selected: string[]) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip
                                        key={value}
                                        label={value}
                                        size="small"
                                        sx={{
                                            backgroundColor: colors.secondary.light,
                                            color: colors.text.primary,
                                            fontWeight: 500,
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    >
                        {breeds.map((breed) => (
                            <MenuItem key={breed} value={breed}>
                                {breed}
                            </MenuItem>
                        ))}
                    </Select>
                </StyledFormControl>

                <Box sx={{ px: 1 }}>
                    <Typography sx={{ color: colors.text.secondary, mb: 1, fontSize: '0.875rem' }}>Age Range</Typography>
                    <Slider
                        value={[filters.ageMin || 0, filters.ageMax || 20]}
                        onChange={handleAgeRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={20}
                        disabled={isLoading}
                        sx={{
                            color: colors.primary.main,
                            '& .MuiSlider-thumb': {
                                backgroundColor: colors.primary.main,
                            },
                            '& .MuiSlider-valueLabel': {
                                backgroundColor: colors.primary.dark,
                            }
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {filters.ageMin} years
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {filters.ageMax} years
                        </Typography>
                    </Box>
                </Box>

                <StyledFormControl fullWidth variant="outlined">
                    <InputLabel>Sort</InputLabel>
                    <Select
                        value={filters.sort || 'breed:asc'}
                        disabled={isLoading}
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
            </Box>
        </GlassBox>
    );
};

export default SearchFilters; 