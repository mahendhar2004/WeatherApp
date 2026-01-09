'use client';

import { useWeather } from '@/hooks/useWeather';
import {
  SearchBar,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  LoadingSkeleton,
} from '@/components';

export default function Home() {
  const {
    weather,
    loading,
    error,
    searchResults,
    searchLoading,
    handleSearch,
    fetchWeather,
    clearSearch,
  } = useWeather();

  return (
    <main
      style={{
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0c0118 0%, #1a0a2e 30%, #16213e 70%, #0f3460 100%)',
      }}
    >
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '800px',
          height: '800px',
          background: 'rgba(139, 92, 246, 0.08)',
          borderRadius: '50%',
          filter: 'blur(150px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '700px',
          height: '700px',
          background: 'rgba(59, 130, 246, 0.08)',
          borderRadius: '50%',
          filter: 'blur(120px)',
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5vh 4vw',
      }}>

        {/* HEADER */}
        <header style={{
          height: '6vh',
          minHeight: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '30px',
          marginBottom: '1.5vh',
          flexShrink: 0,
        }}>
          <h1 style={{ fontSize: 'clamp(18px, 1.8vw, 26px)', fontWeight: 700, color: 'white', flexShrink: 0 }}>
            Weather<span style={{ background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>App</span>
          </h1>

          <div style={{ flex: 1, maxWidth: '450px' }}>
            <SearchBar
              onSearch={handleSearch}
              onSelectCity={fetchWeather}
              searchResults={searchResults}
              loading={searchLoading}
              onClear={clearSearch}
            />
          </div>

          {weather && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 24px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ color: 'white', fontWeight: 600, fontSize: 'clamp(13px, 1vw, 16px)' }}>{weather.location.name}</span>
              {weather.location.country && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(11px, 0.9vw, 14px)' }}>{weather.location.country}</span>
                </>
              )}
            </div>
          )}
        </header>

        {/* Error */}
        {error && (
          <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', textAlign: 'center', color: '#fca5a5', marginBottom: '1.5vh', flexShrink: 0 }}>
            {error}
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {/* MAIN CONTENT */}
        {!loading && weather && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5vw', minHeight: 0 }}>

            {/* Left - Current Weather */}
            <CurrentWeather weather={weather.current} />

            {/* Right - Forecasts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh', minHeight: 0, overflow: 'hidden' }}>
              <div style={{ flexShrink: 0 }}>
                <HourlyForecast hourly={weather.hourly} />
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <DailyForecast daily={weather.daily} />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ height: '3vh', minHeight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
            Powered by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(167,139,250,0.6)' }}>Open-Meteo</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
