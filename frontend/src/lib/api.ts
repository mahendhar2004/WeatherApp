// Weather API Types - matching backend DTOs

export interface CitySearchResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    timezone: string;
}

export interface CurrentWeather {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    weatherDescription: string;
    weatherIcon: string;
    isDay: boolean;
    pressure: number;
    visibility: number;
    uvIndex: number;
}

export interface HourlyForecast {
    time: string;
    temperature: number;
    weatherCode: number;
    weatherDescription: string;
    weatherIcon: string;
    precipitationProbability: number;
    isDay: boolean;
}

export interface DailyForecast {
    date: string;
    dayName: string;
    temperatureMax: number;
    temperatureMin: number;
    weatherCode: number;
    weatherDescription: string;
    weatherIcon: string;
    precipitationProbability: number;
    sunrise: string;
    sunset: string;
    uvIndexMax: number;
}

export interface WeatherData {
    location: {
        name: string;
        country: string;
        latitude: number;
        longitude: number;
        timezone: string;
        localTime: string;
    };
    current: CurrentWeather;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
}

// API Base URL - NestJS backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Search for cities by name
 */
export async function searchCities(query: string): Promise<CitySearchResult[]> {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const response = await fetch(
        `${API_BASE_URL}/api/weather/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error('Failed to search cities');
    }

    return response.json();
}

/**
 * Get weather data for coordinates
 */
export async function getWeather(
    latitude: number,
    longitude: number
): Promise<WeatherData> {
    const response = await fetch(
        `${API_BASE_URL}/api/weather?lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }

    return response.json();
}
