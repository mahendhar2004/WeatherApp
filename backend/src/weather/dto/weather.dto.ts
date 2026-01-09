// DTOs for weather API responses

export class CitySearchResultDto {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Province
  timezone: string;
}

export class CurrentWeatherDto {
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

export class HourlyForecastDto {
  time: string;
  temperature: number;
  weatherCode: number;
  weatherDescription: string;
  weatherIcon: string;
  precipitationProbability: number;
  isDay: boolean;
}

export class DailyForecastDto {
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

export class WeatherResponseDto {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
    localTime: string;
  };
  current: CurrentWeatherDto;
  hourly: HourlyForecastDto[];
  daily: DailyForecastDto[];
}

export class SearchQueryDto {
  q: string;
}

export class WeatherQueryDto {
  lat: number;
  lon: number;
}
