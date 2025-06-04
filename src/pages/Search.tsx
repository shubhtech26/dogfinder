import React, { useState, useEffect, useCallback } from 'react';
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
    useTheme,
    useMediaQuery,
    Drawer,
    Fab,
} from '@mui/material';
import { Favorite, FavoriteBorder, Search as SearchIcon, Clear as ClearIcon, FilterList as FilterListIcon, ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import { useQuery, UseQueryResult, keepPreviousData } from '@tanstack/react-query';
import { searchDogs, getBreeds, getDogsByIds, generateMatch } from '../services/api';
import { Dog, SearchFilters as SearchFiltersType, SearchResponse } from '../types';
import Header from '../components/Header';
import MatchDialog from '../components/MatchDialog';
import SearchFiltersComponent from '../components/SearchFilters';
import { colors } from '../theme/theme';

// Default filter values
const defaultFilters: SearchFiltersType = {
    breeds: [],
    sort: 'breed:asc',
    size: 20,
    ageMin: 0,
    ageMax: 20,
    from: 0,
};

const Search: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Initialize state from localStorage if available
    const [filters, setFilters] = useState<SearchFiltersType>(() => {
        const savedFilters = localStorage.getItem('searchFilters');
        try {
            return savedFilters ? JSON.parse(savedFilters) : defaultFilters;
        } catch (e) {
            return defaultFilters;
        }
    });

    const [page, setPage] = useState(() => {
        const savedPage = localStorage.getItem('currentPage');
        try {
            return savedPage ? parseInt(savedPage, 10) : 1;
        } catch (e) {
            return 1;
        }
    });

    const [favorites, setFavorites] = useState<Set<string>>(() => {
        const savedFavorites = localStorage.getItem('favorites');
        try {
            return new Set(savedFavorites ? JSON.parse(savedFavorites) : []);
        } catch (e) {
            return new Set();
        }
    });

    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
    const [zipCode, setZipCode] = useState(() => {
        const savedZipCode = localStorage.getItem('zipCode');
        return savedZipCode || '';
    });
    const [searchError, setSearchError] = useState<string | null>(null);
    const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);

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
    const { data: breedsData = [], error: breedsError }: UseQueryResult<string[], Error> = useQuery<string[], Error>({
        queryKey: ['breeds'],
        queryFn: getBreeds,
    });

    const currentFrom = (page - 1) * (filters.size || 20);
    const { data: searchResponse, isLoading: isSearchLoading, error: dogSearchError }: UseQueryResult<SearchResponse, Error> = 
        useQuery<SearchResponse, Error, SearchResponse, any>({
            queryKey: ['dogs', { ...filters, from: currentFrom }],
            queryFn: () => searchDogs({ ...filters, from: currentFrom }),
            placeholderData: keepPreviousData,
    });

    const { data: dogs = [], isLoading: isDogsLoading, error: dogDetailsError }: UseQueryResult<Dog[], Error> = 
        useQuery<Dog[], Error, Dog[], any>({
            queryKey: ['dogDetails', searchResponse?.resultIds],
            queryFn: async () => {
                if (!searchResponse?.resultIds?.length) return [];
                return getDogsByIds(searchResponse.resultIds);
            },
            enabled: !!searchResponse?.resultIds?.length && searchResponse.resultIds.length > 0,
            placeholderData: keepPreviousData,
    });

    useEffect(() => {
        const latestError = dogSearchError || dogDetailsError || breedsError;
        if (latestError) {
            setSearchError(latestError.message || 'An error occurred while fetching data.');
        } else {
            setSearchError(null);
        }
    }, [dogSearchError, dogDetailsError, breedsError]);

    const handleFiltersChange = useCallback((newFilters: Partial<SearchFiltersType>) => {
        setFilters(prev => ({ ...prev, ...newFilters, from: 0 }));
        setPage(1); 
    }, []);

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
        window.scrollTo(0, 0);
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

    const handleClearFavorite = useCallback(() => {
        setFavorites(new Set());
    }, []);

    const handleGenerateMatch = async () => {
        if (favorites.size === 0) {
            setSearchError('Please select a favorite dog first to find a match.');
            return;
        }
        setSearchError(null);
        setIsGeneratingMatch(true);
        try {
            const match = await generateMatch(Array.from(favorites));
            const [matchedDogDetails] = await getDogsByIds([match.match]);
            setMatchedDog(matchedDogDetails);
            setIsMatchDialogOpen(true);
        } catch (error) {
            console.error('Failed to generate match:', error);
            setSearchError(error instanceof Error ? error.message : 'Failed to generate match. Please try again.');
        } finally {
            setIsGeneratingMatch(false);
        }
    };

    const clearAllFiltersAndFavorites = useCallback(() => {
        setFilters(defaultFilters);
        setZipCode('');
        setPage(1);
        localStorage.removeItem('searchFilters');
        localStorage.removeItem('currentPage');
        localStorage.removeItem('zipCode');
        localStorage.removeItem('favorites');
        setSearchError(null);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isLoadingPrimary = isSearchLoading || (isDogsLoading && (!searchResponse?.resultIds || searchResponse.resultIds.length > 0));

    const filtersSidebarComponent = (
        <SearchFiltersComponent 
            filters={filters} 
            breeds={breedsData} 
            onFiltersChange={handleFiltersChange} 
            onClearAllFilters={clearAllFiltersAndFavorites}
            isLoading={isLoadingPrimary}
            favoriteCount={favorites.size}
            onGenerateMatch={handleGenerateMatch}
            onClearFavorite={handleClearFavorite}
            isGeneratingMatch={isGeneratingMatch}
        />
    );

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            background: colors.background.gradient,
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url(/paw-pattern.svg) repeat',
                opacity: 0.07,
                zIndex: -1,
            },
        }}>
            <Header />
            <Container maxWidth="xl" sx={{ mt: '80px', p: { xs: 1, md: 3 }, flexGrow: 1, zIndex: 1 }}>
                <Grid container spacing={3}>
                    {!isMobile && (
                        <Grid item md={3} sx={{ 
                            position: 'sticky', 
                            top: '80px', 
                            height: 'calc(100vh - 100px)',
                            overflowY: 'auto',
                            pr: 1,
                        }}>
                           {filtersSidebarComponent}
                        </Grid>
                    )}
                    <Grid item xs={12} md={isMobile ? 12 : 9}>
                        {searchError && (
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: 2, 
                                    mb: 2, 
                                    bgcolor: colors.error.light + '33',
                                    color: colors.error.dark,
                                    border: `1px solid ${colors.error.main}`,
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="body1">{searchError}</Typography>
                            </Paper>
                        )}

                        {isLoadingPrimary && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                                <CircularProgress sx={{ color: colors.primary.main }} size={60}/>
                            </Box>
                        )}

                        {!isLoadingPrimary && dogs.length === 0 && !searchError && (
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: {xs: 2, md: 4}, 
                                    textAlign: 'center',
                                    bgcolor: colors.background.paper,
                                    borderRadius: '16px',
                                    border: `1px solid ${colors.custom.cardBorder}`,
                                }}
                            >
                                <Typography variant="h5" sx={{ color: colors.text.primary, mb: 1 }}>
                                    No Paws Found!
                                </Typography>
                                <Typography sx={{ color: colors.text.secondary }}>
                                    Try adjusting your search filters or check back later for new furry friends.
                                </Typography>
                            </Paper>
                        )}

                        {!isLoadingPrimary && dogs.length > 0 && (
                            <Grid container spacing={isMobile ? 2 : 3}>
                                {dogs.map((dog: Dog) => (
                                    <Grid item key={dog.id} xs={12} sm={6} md={4} lg={3}>
                                        <Card 
                                            sx={{ 
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                bgcolor: colors.background.card,
                                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                                '&:hover': {
                                                    transform: 'translateY(-6px)',
                                                    boxShadow: `0 8px 16px ${colors.primary.main}33`,
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
                                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="h6" component="div" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
                                                        {dog.name}
                                                    </Typography>
                                                    <IconButton
                                                        onClick={() => toggleFavorite(dog.id)}
                                                        sx={{ 
                                                            color: favorites.has(dog.id) ? colors.primary.main : colors.text.secondary,
                                                            p: '6px',
                                                            '&:hover': {
                                                                backgroundColor: `${colors.primary.main}1A`,
                                                            }
                                                        }}
                                                    >
                                                        {favorites.has(dog.id) ? <Favorite fontSize="medium" /> : <FavoriteBorder fontSize="medium" />}
                                                    </IconButton>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                                                    <strong>Breed:</strong> {dog.breed}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                                                    <strong>Age:</strong> {dog.age} years
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                                    <strong>Location:</strong> {dog.zip_code}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {searchResponse && searchResponse.total > (filters.size || 20) && !isLoadingPrimary && dogs.length > 0 && (
                            <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    count={Math.ceil((searchResponse?.total || 0) / (filters.size || 20))}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: colors.text.secondary,
                                        },
                                        '& .MuiPaginationItem-root.Mui-selected': {
                                            backgroundColor: colors.primary.main,
                                            color: colors.text.light,
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiPaginationItem-root:hover': {
                                            backgroundColor: `${colors.primary.light}4D`,
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {isMobile && (
                <Fab 
                    color="secondary" 
                    aria-label="filters" 
                    onClick={() => setMobileFiltersOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        bgcolor: colors.primary.main,
                        color: colors.text.light,
                        '&:hover': {
                            bgcolor: colors.primary.dark
                        }
                    }}
                >
                    <FilterListIcon />
                </Fab>
            )}
            {showScrollTop && (
                 <Fab 
                    size="small"
                    onClick={scrollToTop}
                    aria-label="scroll back to top"
                    sx={{
                        position: 'fixed',
                        bottom: isMobile ? 80 : 16,
                        right: 16,
                        bgcolor: colors.secondary.main,
                        color: colors.text.primary,
                        '&:hover': {
                            bgcolor: colors.secondary.dark
                        }
                    }}
                >
                    <ArrowUpwardIcon />
                </Fab>
            )}

            <Drawer
                anchor="bottom"
                open={isMobile && mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                PaperProps={{
                    sx: {
                        height: '80vh',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        p: 2,
                        bgcolor: colors.background.default
                    }
                }}
            >
                <Box sx={{ overflowY: 'auto', flexGrow: 1, p:1 }}>
                    {filtersSidebarComponent}
                </Box>
                <Button onClick={() => setMobileFiltersOpen(false)} variant="contained" sx={{ mt: 2, bgcolor: colors.primary.main }}>
                    Show Results
                </Button>
            </Drawer>

            <MatchDialog
                open={isMatchDialogOpen}
                onClose={() => setIsMatchDialogOpen(false)}
                matchedDog={matchedDog}
            />
        </Box>
    );
};

export default Search; 