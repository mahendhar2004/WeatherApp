# ☀️ WeatherApp

A beautiful, modern weather application built with **NestJS** backend and **Next.js** frontend, featuring a premium glassmorphism UI design.

![Weather App Screenshot](https://drive.google.com/uc?export=view&id=1RVvnfydiW3Zs980FWA6BvgpiJLKnDgu8)

## ✨ Features

- 🌡️ **Real-time Weather Data** - Current temperature, humidity, wind speed, pressure, UV index
- 🕐 **24-Hour Forecast** - Hourly weather predictions starting from current time
- 📅 **7-Day Forecast** - Weekly weather outlook with temperature ranges
- 🔍 **City Search** - Autocomplete search with keyboard navigation
- 📍 **Geolocation** - Automatically detect user's location on first load
- 🎨 **Premium UI** - Dark glassmorphism design with subtle animations
- 📱 **Responsive** - Optimized for desktop and mobile devices

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Next.js Frontend                         │   │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐   │   │
│  │  │  page.tsx │  │  Components  │  │  useWeather.ts  │   │   │
│  │  │ (Layout)  │  │  (UI Layer)  │  │   (State Mgmt)  │   │   │
│  │  └──────────┘  └──────────────┘  └─────────────────┘   │   │
│  │                        │                                 │   │
│  │                   ┌────▼────┐                           │   │
│  │                   │ api.ts  │  (API Client)             │   │
│  │                   └────┬────┘                           │   │
│  └────────────────────────│────────────────────────────────┘   │
│                           │ HTTP (localhost:3001)              │
└───────────────────────────│─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      NestJS Backend                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 WeatherController                        │   │
│  │    GET /api/weather/search?q=...                        │   │
│  │    GET /api/weather?lat=...&lon=...                     │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │                  WeatherService                          │   │
│  │  • searchCities() - City autocomplete                   │   │
│  │  • getWeather() - Fetch & transform weather data        │   │
│  │  • getLocationName() - Reverse geocoding                │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
└───────────────────────────│─────────────────────────────────────┘
                            │ HTTP
┌───────────────────────────▼─────────────────────────────────────┐
│                    External APIs                                 │
│  ┌─────────────────────┐  ┌────────────────────────────────┐   │
│  │    Open-Meteo       │  │      BigDataCloud              │   │
│  │  • Weather Data     │  │  • Reverse Geocoding           │   │
│  │  • City Search      │  │  • City/Country Names          │   │
│  └─────────────────────┘  └────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
Weather/
├── backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── main.ts         # Entry point, CORS config
│   │   ├── app.module.ts   # Root module
│   │   └── weather/
│   │       ├── weather.module.ts
│   │       ├── weather.controller.ts   # REST endpoints
│   │       ├── weather.service.ts      # Business logic
│   │       └── dto/
│   │           └── weather.dto.ts      # Type definitions
│   └── package.json
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx  # Root layout
│   │   │   ├── page.tsx    # Main page
│   │   │   └── globals.css # Global styles
│   │   ├── components/
│   │   │   ├── CurrentWeather.tsx
│   │   │   ├── HourlyForecast.tsx
│   │   │   ├── DailyForecast.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── WeatherIcon.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   ├── hooks/
│   │   │   └── useWeather.ts   # Weather state management
│   │   └── lib/
│   │       └── api.ts          # API client & types
│   └── package.json
│
└── README.md
```

## 🔄 Data Flow

1. **User Action** → User searches for a city or grants location permission
2. **Frontend Hook** → `useWeather.ts` calls API client
3. **API Client** → `api.ts` makes HTTP request to backend
4. **Backend Controller** → Receives request, validates params
5. **Backend Service** → Fetches data from Open-Meteo & BigDataCloud
6. **Data Transformation** → Converts raw API response to typed DTOs
7. **Response** → Returns structured JSON to frontend
8. **UI Update** → React re-renders components with new data

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | Next.js 14 (App Router) |
| Frontend Styling | Tailwind CSS + Inline Styles |
| Backend Framework | NestJS |
| HTTP Client | Axios |
| Weather API | Open-Meteo (Free) |
| Geocoding API | BigDataCloud (Free) |
| Language | TypeScript |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahendhar2004/WeatherApp.git
   cd WeatherApp
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend** (Terminal 1)
   ```bash
   cd backend
   npm run start:dev
   ```
   Backend runs on `http://localhost:3001`

2. **Start the frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

3. **Open your browser** at `http://localhost:3000`

## 📡 API Endpoints

### Search Cities
```
GET /api/weather/search?q={query}
```
Returns list of matching cities with coordinates.

### Get Weather
```
GET /api/weather?lat={latitude}&lon={longitude}
```
Returns current weather, hourly (24h), and daily (7 days) forecast.

## 🎨 UI Components

| Component | Description |
|-----------|-------------|
| `CurrentWeather` | Displays temperature, feels like, weather icon, and stats |
| `HourlyForecast` | Horizontal scrollable 24-hour forecast |
| `DailyForecast` | 7-day forecast with temperature range bars |
| `SearchBar` | Autocomplete city search with dropdown |
| `WeatherIcon` | Emoji-based weather icons |
| `LoadingSkeleton` | Loading state placeholder |

## 🌐 External APIs Used

### Open-Meteo
- **Weather Forecast**: `https://api.open-meteo.com/v1/forecast`
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
- Free, no API key required

### BigDataCloud
- **Reverse Geocoding**: `https://api.bigdatacloud.net/data/reverse-geocode-client`
- Free tier, no API key required

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Mahendhar** - [GitHub](https://github.com/mahendhar2004)

---

⭐ Star this repo if you found it helpful!
