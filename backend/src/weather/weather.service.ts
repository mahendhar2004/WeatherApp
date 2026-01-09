import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import {
    CitySearchResultDto,
    WeatherResponseDto,
    CurrentWeatherDto,
    HourlyForecastDto,
    DailyForecastDto,
} from './dto/weather.dto';

// Weather code mappings from Open-Meteo WMO codes
const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
    0: { description: 'Clear sky', icon: 'clear' },
    1: { description: 'Mainly clear', icon: 'clear' },
    2: { description: 'Partly cloudy', icon: 'partly-cloudy' },
    3: { description: 'Overcast', icon: 'cloudy' },
    45: { description: 'Foggy', icon: 'fog' },
    48: { description: 'Depositing rime fog', icon: 'fog' },
    51: { description: 'Light drizzle', icon: 'drizzle' },
    53: { description: 'Moderate drizzle', icon: 'drizzle' },
    55: { description: 'Dense drizzle', icon: 'drizzle' },
    56: { description: 'Light freezing drizzle', icon: 'sleet' },
    57: { description: 'Dense freezing drizzle', icon: 'sleet' },
    61: { description: 'Slight rain', icon: 'rain' },
    63: { description: 'Moderate rain', icon: 'rain' },
    65: { description: 'Heavy rain', icon: 'rain-heavy' },
    66: { description: 'Light freezing rain', icon: 'sleet' },
    67: { description: 'Heavy freezing rain', icon: 'sleet' },
    71: { description: 'Slight snow', icon: 'snow' },
    73: { description: 'Moderate snow', icon: 'snow' },
    75: { description: 'Heavy snow', icon: 'snow-heavy' },
    77: { description: 'Snow grains', icon: 'snow' },
    80: { description: 'Slight rain showers', icon: 'rain' },
    81: { description: 'Moderate rain showers', icon: 'rain' },
    82: { description: 'Violent rain showers', icon: 'rain-heavy' },
    85: { description: 'Slight snow showers', icon: 'snow' },
    86: { description: 'Heavy snow showers', icon: 'snow-heavy' },
    95: { description: 'Thunderstorm', icon: 'thunderstorm' },
    96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm' },
};

@Injectable()
export class WeatherService {
    private readonly geocodingApiUrl = 'https://geocoding-api.open-meteo.com/v1';
    private readonly weatherApiUrl = 'https://api.open-meteo.com/v1';

    /**
     * Search for cities by name
     * Uses Open-Meteo Geocoding API to convert city names to coordinates
     */
    async searchCities(query: string): Promise<CitySearchResultDto[]> {
        if (!query || query.trim().length < 2) {
            return [];
        }

        try {
            const response = await axios.get(`${this.geocodingApiUrl}/search`, {
                params: {
                    name: query.trim(),
                    count: 10,
                    language: 'en',
                    format: 'json',
                },
            });

            if (!response.data.results) {
                return [];
            }

            return response.data.results.map((result: any) => ({
                id: result.id,
                name: result.name,
                latitude: result.latitude,
                longitude: result.longitude,
                country: result.country || '',
                admin1: result.admin1 || '',
                timezone: result.timezone || 'UTC',
            }));
        } catch (error) {
            console.error('Geocoding API error:', error);
            throw new HttpException(
                'Failed to search cities',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    /**
     * Get weather data for a specific location
     * Fetches current weather, hourly forecast (24h), and daily forecast (7 days)
     */
    async getWeather(
        latitude: number,
        longitude: number,
    ): Promise<WeatherResponseDto> {
        try {
            // Fetch weather data with all required parameters
            const response = await axios.get(`${this.weatherApiUrl}/forecast`, {
                params: {
                    latitude,
                    longitude,
                    // Current weather parameters
                    current: [
                        'temperature_2m',
                        'relative_humidity_2m',
                        'apparent_temperature',
                        'is_day',
                        'precipitation',
                        'weather_code',
                        'pressure_msl',
                        'wind_speed_10m',
                        'wind_direction_10m',
                        'uv_index',
                    ].join(','),
                    // Hourly forecast parameters (for next 24 hours)
                    hourly: [
                        'temperature_2m',
                        'weather_code',
                        'precipitation_probability',
                        'is_day',
                    ].join(','),
                    // Daily forecast parameters (for next 7 days)
                    daily: [
                        'weather_code',
                        'temperature_2m_max',
                        'temperature_2m_min',
                        'sunrise',
                        'sunset',
                        'precipitation_probability_max',
                        'uv_index_max',
                    ].join(','),
                    timezone: 'auto',
                    forecast_days: 7,
                },
            });

            const data = response.data;

            // Get location name via reverse geocoding
            const locationInfo = await this.getLocationName(latitude, longitude);

            // Parse and transform the response
            return this.transformWeatherData(data, locationInfo);
        } catch (error) {
            console.error('Weather API error:', error);
            throw new HttpException(
                'Failed to fetch weather data',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    /**
     * Reverse geocode to get location name
     * Uses BigDataCloud free reverse geocoding API
     */
    private async getLocationName(
        latitude: number,
        longitude: number,
    ): Promise<{ name: string; country: string }> {
        try {
            // Use BigDataCloud free reverse geocoding API
            const response = await axios.get(
                'https://api.bigdatacloud.net/data/reverse-geocode-client',
                {
                    params: {
                        latitude,
                        longitude,
                        localityLanguage: 'en',
                    },
                },
            );

            if (response.data) {
                const city = response.data.city || response.data.locality || response.data.principalSubdivision;
                const country = response.data.countryName || '';

                if (city) {
                    return { name: city, country };
                }
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
        }

        // Fallback: try to find nearest city using Open-Meteo search
        try {
            const searchResponse = await axios.get(`${this.geocodingApiUrl}/search`, {
                params: {
                    latitude,
                    longitude,
                    count: 1,
                },
            });

            if (searchResponse.data.results && searchResponse.data.results.length > 0) {
                return {
                    name: searchResponse.data.results[0].name,
                    country: searchResponse.data.results[0].country || '',
                };
            }
        } catch (error) {
            // Ignore fallback errors
        }

        return { name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`, country: '' };
    }

    /**
     * Transform raw API data into our DTO format
     */
    private transformWeatherData(
        data: any,
        locationInfo: { name: string; country: string },
    ): WeatherResponseDto {
        const weatherCode = data.current.weather_code;
        const weatherInfo = WEATHER_CODES[weatherCode] || {
            description: 'Unknown',
            icon: 'clear',
        };

        // Current weather
        const current: CurrentWeatherDto = {
            temperature: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            windDirection: data.current.wind_direction_10m,
            weatherCode: weatherCode,
            weatherDescription: weatherInfo.description,
            weatherIcon: data.current.is_day
                ? weatherInfo.icon
                : `${weatherInfo.icon}-night`,
            isDay: data.current.is_day === 1,
            pressure: Math.round(data.current.pressure_msl),
            visibility: 10, // Open-Meteo doesn't provide visibility in basic plan
            uvIndex: data.current.uv_index || 0,
        };

        // Hourly forecast (next 24 hours starting from current hour)
        const hourly: HourlyForecastDto[] = [];
        const now = new Date();
        const currentHourTimestamp = now.getTime();

        // Find the index of the current hour in the data
        let startIndex = 0;
        for (let i = 0; i < data.hourly.time.length; i++) {
            const hourTime = new Date(data.hourly.time[i]).getTime();
            if (hourTime >= currentHourTimestamp - 3600000) { // Within last hour
                startIndex = i;
                break;
            }
        }

        // Get next 24 hours from current time
        for (let i = startIndex; i < startIndex + 24 && i < data.hourly.time.length; i++) {
            const hourWeatherCode = data.hourly.weather_code[i];
            const hourWeatherInfo = WEATHER_CODES[hourWeatherCode] || {
                description: 'Unknown',
                icon: 'clear',
            };
            const isDay = data.hourly.is_day[i] === 1;

            hourly.push({
                time: data.hourly.time[i],
                temperature: Math.round(data.hourly.temperature_2m[i]),
                weatherCode: hourWeatherCode,
                weatherDescription: hourWeatherInfo.description,
                weatherIcon: isDay
                    ? hourWeatherInfo.icon
                    : `${hourWeatherInfo.icon}-night`,
                precipitationProbability: data.hourly.precipitation_probability[i] || 0,
                isDay,
            });
        }

        // Daily forecast (7 days)
        const daily: DailyForecastDto[] = data.daily.time.map(
            (date: string, index: number) => {
                const dayWeatherCode = data.daily.weather_code[index];
                const dayWeatherInfo = WEATHER_CODES[dayWeatherCode] || {
                    description: 'Unknown',
                    icon: 'clear',
                };

                const dateObj = new Date(date);
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                return {
                    date,
                    dayName: index === 0 ? 'Today' : dayNames[dateObj.getDay()],
                    temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
                    temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
                    weatherCode: dayWeatherCode,
                    weatherDescription: dayWeatherInfo.description,
                    weatherIcon: dayWeatherInfo.icon,
                    precipitationProbability:
                        data.daily.precipitation_probability_max[index] || 0,
                    sunrise: data.daily.sunrise[index],
                    sunset: data.daily.sunset[index],
                    uvIndexMax: data.daily.uv_index_max[index] || 0,
                };
            },
        );

        return {
            location: {
                name: locationInfo.name,
                country: locationInfo.country,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone,
                localTime: new Date().toISOString(),
            },
            current,
            hourly,
            daily,
        };
    }
}
