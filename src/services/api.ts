import axios from 'axios';
import { Dog, LoginCredentials, SearchFilters, SearchResponse, Location, Match } from '../types';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
        await api.post('/auth/login', credentials);
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Login failed. Please check your credentials and try again.');
    }
};

export const logout = async (): Promise<void> => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Logout failed. Please try again.');
    }
};

export const searchDogs = async (filters: SearchFilters): Promise<SearchResponse> => {
    try {
        const { data } = await api.get('/dogs/search', { params: filters });
        return data;
    } catch (error) {
        console.error('Search dogs error:', error);
        throw new Error('Failed to search dogs. Please try again.');
    }
};

export const getDogsByIds = async (ids: string[]): Promise<Dog[]> => {
    try {
        const { data } = await api.post('/dogs', ids);
        return data;
    } catch (error) {
        console.error('Get dogs error:', error);
        throw new Error('Failed to fetch dog details. Please try again.');
    }
};

export const getBreeds = async (): Promise<string[]> => {
    try {
        const { data } = await api.get('/dogs/breeds');
        return data;
    } catch (error) {
        console.error('Get breeds error:', error);
        throw new Error('Failed to fetch breeds. Please try again.');
    }
};

export const getLocations = async (zipCodes: string[]): Promise<Location[]> => {
    try {
        const { data } = await api.post('/locations', zipCodes);
        return data;
    } catch (error) {
        console.error('Get locations error:', error);
        throw new Error('Failed to fetch locations. Please try again.');
    }
};

export const generateMatch = async (dogIds: string[]): Promise<Match> => {
    try {
        const { data } = await api.post('/dogs/match', dogIds);
        return data;
    } catch (error) {
        console.error('Generate match error:', error);
        throw new Error('Failed to generate match. Please try again.');
    }
}; 