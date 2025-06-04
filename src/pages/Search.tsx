import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Button,
    IconButton,
    Chip,
    SelectChangeEvent,
    Paper,
    Slider,
    TextField,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import { Favorite, FavoriteBorder, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { searchDogs, getBreeds, getDogsByIds, generateMatch } from '../services/api';
import { Dog, SearchFilters, SearchResponse } from '../types';
import Header from '../components/Header';
import MatchDialog from '../components/MatchDialog';

// Default filter values
const defaultFilters: SearchFilters = {
    breeds: [],
    sort: 'breed:asc',
    size: 20,
    ageMin: 0,
    ageMax: 20,
};

const Search: React.FC = () => {
    // Initialize state from localStorage if available
    const [filters, setFilters] = useState<SearchFilters>(() => {
        const savedFilters = localStorage.getItem('searchFilters');
        return savedFilters ? JSON.parse(savedFilters) : defaultFilters;
    });

    const [page, setPage] = useState(() => {
        const savedPage = localStorage.getItem('currentPage');
        return savedPage ? parseInt(savedPage, 10) : 1;
    });

    const [favorites, setFavorites] = useState<Set<string>>(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return new Set(savedFavorites ? JSON.parse(savedFavorites) : []);
    });

    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
    const [zipCode, setZipCode] = useState(() => {
        const savedZipCode = localStorage.getItem('zipCode');
        return savedZipCode || '';
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Persist state changes to localStorage
    useEffect(() => {
        localStorage.setItem('searchFilters', JSON.stringify(filters));
    }, [filters]);

    useEffect(() => {
        localStorage.setItem('currentPage', page.toString());
    }, [page]);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('zipCode', zipCode);
    }, [zipCode]);

    // Query hooks with proper error handling
    const { data: breeds = [] }: UseQueryResult<string[], Error> = useQuery({
        queryKey: ['breeds'],
        queryFn: getBreeds,
    });

    const { data: searchResponse, isLoading: isSearchLoading }: UseQueryResult<SearchResponse, Error> = useQuery({
        queryKey: ['dogs', filters],
        queryFn: () => searchDogs(filters),
    });

    const { data: dogs = [], isLoading: isDogsLoading }: UseQueryResult<Dog[], Error> = useQuery({
        queryKey: ['dogDetails', searchResponse?.resultIds],
        queryFn: async () => {
            if (!searchResponse?.resultIds?.length) {
                return [];
            }
            return getDogsByIds(searchResponse.resultIds);
        },
        enabled: !!searchResponse?.resultIds?.length,
    });

    const handleBreedChange = (event: SelectChangeEvent<string[]>) => {
        const { value } = event.target;
        setFilters(prev => ({
            ...prev,
            breeds: typeof value === 'string' ? value.split(',') : value,
        }));
        setPage(1);
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        setFilters(prev => ({
            ...prev,
            sort: event.target.value,
        }));
        setPage(1);
    };

    const handleAgeRangeChange = (event: Event, newValue: number | number[]) => {
        const [min, max] = newValue as number[];
        setFilters(prev => ({
            ...prev,
            ageMin: min,
            ageMax: max
        }));
        setPage(1);
    };

    const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setZipCode(value);
        if (value) {
            setFilters(prev => ({
                ...prev,
                zipCodes: [value]
            }));
        } else {
            const { zipCodes, ...rest } = filters;
            setFilters(rest);
        }
        setPage(1);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        const from = (value - 1) * filters.size!;
        setFilters(prev => ({ ...prev, from }));
    };

    const toggleFavorite = (dogId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set<string>();
            if (!prev.has(dogId)) {
                newFavorites.add(dogId);
            }
            return newFavorites;
        });
    };

    const handleGenerateMatch = async () => {
        if (favorites.size === 0) {
            setError('Please select a dog to generate a match');
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            const match = await generateMatch(Array.from(favorites));
            const [matchedDogDetails] = await getDogsByIds([match.match]);
            setMatchedDog(matchedDogDetails);
            setIsMatchDialogOpen(true);
        } catch (error) {
            console.error('Failed to generate match:', error);
            setError('Failed to generate match. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setFilters(defaultFilters);
        setZipCode('');
        setPage(1);
        localStorage.removeItem('searchFilters');
        localStorage.removeItem('currentPage');
        localStorage.removeItem('zipCode');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <Header 
                favoriteCount={favorites.size}
                onGenerateMatch={handleGenerateMatch}
            />
            <Box sx={{ display: 'flex', flex: 1, p: { xs: 1, md: 2 }, mt: 8 }}>
                {/* Left Sidebar with Filters */}
                <Paper 
                    elevation={2} 
                    sx={{ 
                        width: { xs: '100%', md: '300px' },
                        height: 'fit-content',
                        p: 2,
                        mr: { xs: 0, md: 2 },
                        position: { xs: 'static', md: 'sticky' },
                        top: '88px',
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#1976d2' }}>
                            Search Filters
                        </Typography>
                        <IconButton onClick={clearSearch} size="small">
                            <ClearIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Zip Code"
                            value={zipCode}
                            onChange={handleZipCodeChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl fullWidth size="small">
                            <InputLabel>Breeds</InputLabel>
                            <Select
                                multiple
                                value={filters.breeds || []}
                                onChange={handleBreedChange}
                                renderValue={(selected: string[]) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value: string) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                            >
                                {breeds.map((breed: string) => (
                                    <MenuItem key={breed} value={breed}>
                                        {breed}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ px: 1 }}>
                            <Typography gutterBottom>Age Range</Typography>
                            <Slider
                                value={[filters.ageMin || 0, filters.ageMax || 20]}
                                onChange={handleAgeRangeChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={20}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {filters.ageMin} years
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {filters.ageMax} years
                                </Typography>
                            </Box>
                        </Box>

                        <FormControl fullWidth size="small">
                            <InputLabel>Sort</InputLabel>
                            <Select value={filters.sort || ''} onChange={handleSortChange}>
                                <MenuItem value="breed:asc">Breed (A-Z)</MenuItem>
                                <MenuItem value="breed:desc">Breed (Z-A)</MenuItem>
                                <MenuItem value="name:asc">Name (A-Z)</MenuItem>
                                <MenuItem value="name:desc">Name (Z-A)</MenuItem>
                                <MenuItem value="age:asc">Age (Youngest)</MenuItem>
                                <MenuItem value="age:desc">Age (Oldest)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>

                {/* Mobile Filters */}
                <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2, width: '100%' }}>
                    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                        {/* Same filter content as desktop, just rendered for mobile */}
                    </Paper>
                </Box>

                {/* Main Content Area */}
                <Box sx={{ flex: 1 }}>
                    {error && (
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 2, 
                                mb: 2, 
                                bgcolor: '#ffebee',
                                color: '#c62828',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Typography>{error}</Typography>
                        </Paper>
                    )}

                    {(isSearchLoading || isDogsLoading || isLoading) && (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            minHeight: '200px'
                        }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!isSearchLoading && !isDogsLoading && dogs.length === 0 && (
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 4, 
                                textAlign: 'center',
                                bgcolor: '#fff',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No Dogs Found
                            </Typography>
                            <Typography color="text.secondary">
                                Try adjusting your search filters to find more dogs.
                            </Typography>
                        </Paper>
                    )}

                    {!isSearchLoading && !isDogsLoading && dogs.length > 0 && (
                        <>
                            <Grid container spacing={2}>
                                {dogs.map((dog: Dog) => (
                                    <Grid item key={dog.id} xs={12} sm={6} md={4} lg={3}>
                                        <Card 
                                            elevation={2}
                                            sx={{ 
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)'
                                                }
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="250"
                                                image={dog.img}
                                                alt={dog.name}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center', 
                                                    mb: 1 
                                                }}>
                                                    <Typography variant="h6" component="div" sx={{ color: '#1976d2' }}>
                                                        {dog.name}
                                                    </Typography>
                                                    <IconButton
                                                        onClick={() => toggleFavorite(dog.id)}
                                                        color="primary"
                                                        sx={{ 
                                                            '&:hover': {
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        {favorites.has(dog.id) ? <Favorite /> : <FavoriteBorder />}
                                                    </IconButton>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Breed: {dog.breed}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Age: {dog.age} years
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Location: {dog.zip_code}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {searchResponse && searchResponse.total > 0 && (
                                <Box sx={{ 
                                    mt: 4, 
                                    mb: 2, 
                                    display: 'flex', 
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Typography color="text.secondary">
                                        Showing {dogs.length} of {searchResponse.total} dogs
                                    </Typography>
                                    <Pagination
                                        count={Math.ceil((searchResponse?.total || 0) / filters.size!)}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        disabled={isSearchLoading || isDogsLoading}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            <MatchDialog
                open={isMatchDialogOpen}
                onClose={() => setIsMatchDialogOpen(false)}
                matchedDog={matchedDog}
            />
        </Box>
    );
};

export default Search; 