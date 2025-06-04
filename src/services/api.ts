import axios from 'axios';
import { Dog, LoginCredentials, SearchFilters, SearchResponse, Location, Match } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const login = async (credentials: LoginCredentials): Promise<void> => {
    await api.post('/auth/login', credentials);
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

export const searchDogs = async (filters: SearchFilters): Promise<SearchResponse> => {
    const { data } = await api.get('/dogs/search', { params: filters });
    return data;
};

export const getDogsByIds = async (ids: string[]): Promise<Dog[]> => {
    const { data } = await api.post('/dogs', ids);
    return data;
};

export const getBreeds = async (): Promise<string[]> => {
    const { data } = await api.get('/dogs/breeds');
    return data;
};

export const getLocations = async (zipCodes: string[]): Promise<Location[]> => {
    const { data } = await api.post('/locations', zipCodes);
    return data;
};

export const generateMatch = async (dogIds: string[]): Promise<Match> => {
    const { data } = await api.post('/dogs/match', dogIds);
    return data;
}; 