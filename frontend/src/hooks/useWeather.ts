'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    WeatherData,
    CitySearchResult,
    searchCities,
    getWeather
} from '@/lib/api';

/**
 * Custom hook for weather data management
 * Handles city search, weather fetching, and loading states
 */
export function useWeather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Search for cities with debouncing handled by the component
    const handleSearch = useCallback(async (query: string) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const results = await searchCities(query);
            setSearchResults(results);
        } catch (err) {
            console.error('Search error:', err);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Fetch weather for selected city
    const fetchWeather = useCallback(async (city: CitySearchResult) => {
        setLoading(true);
        setError(null);
        setSearchResults([]); // Clear search results

        try {
            const data = await getWeather(city.latitude, city.longitude);
            // Override location name with the city we searched for
            data.location.name = city.name;
            data.location.country = city.country;
            setWeather(data);
        } catch (err) {
            console.error('Weather fetch error:', err);
            setError('Failed to fetch weather data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch weather by coordinates (for geolocation)
    const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
        setLoading(true);
        setError(null);

        try {
            const data = await getWeather(lat, lon);
            setWeather(data);
        } catch (err) {
            console.error('Weather fetch error:', err);
            setError('Failed to fetch weather data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Try to get user's location on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherByCoords(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                },
                () => {
                    // Default to London if geolocation fails
                    fetchWeatherByCoords(51.5074, -0.1278);
                }
            );
        } else {
            // Default to London
            fetchWeatherByCoords(51.5074, -0.1278);
        }
    }, [fetchWeatherByCoords]);

    return {
        weather,
        loading,
        error,
        searchResults,
        searchLoading,
        handleSearch,
        fetchWeather,
        clearSearch: () => setSearchResults([]),
    };
}
