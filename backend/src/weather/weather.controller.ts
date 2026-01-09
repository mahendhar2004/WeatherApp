import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import {
    CitySearchResultDto,
    WeatherResponseDto,
} from './dto/weather.dto';

/**
 * Weather Controller
 * 
 * Exposes two endpoints:
 * 1. GET /api/weather/search?q={city} - Search for cities by name
 * 2. GET /api/weather?lat={lat}&lon={lon} - Get weather for coordinates
 */
@Controller('api/weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) { }

    /**
     * Search cities by name
     * Uses Open-Meteo Geocoding API to find matching cities
     * 
     * @param q - Search query (city name)
     * @returns Array of matching cities with coordinates
     */
    @Get('search')
    async searchCities(@Query('q') q: string): Promise<CitySearchResultDto[]> {
        return this.weatherService.searchCities(q);
    }

    /**
     * Get weather forecast for a location
     * Returns current weather, 24-hour hourly forecast, and 7-day daily forecast
     * 
     * @param lat - Latitude
     * @param lon - Longitude
     * @returns Complete weather data including current, hourly, and daily forecasts
     */
    @Get()
    async getWeather(
        @Query('lat') lat: string,
        @Query('lon') lon: string,
    ): Promise<WeatherResponseDto> {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        return this.weatherService.getWeather(latitude, longitude);
    }
}
