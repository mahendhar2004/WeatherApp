'use client';

import { CurrentWeather as CurrentWeatherType } from '@/lib/api';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
    weather: CurrentWeatherType;
}

export function CurrentWeather({ weather }: CurrentWeatherProps) {
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {/* Glow */}
            <div style={{
                position: 'absolute',
                inset: '-20px',
                background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
                borderRadius: '50px',
                filter: 'blur(40px)',
            }} />

            {/* Card */}
            <div style={{
                position: 'relative',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '28px',
                padding: '3vh 2.5vw',
                display: 'flex',
                flexDirection: 'column',
            }}>

                {/* Date & Time */}
                <div style={{ textAlign: 'center', marginBottom: '2vh' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>{currentDate}</p>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '28px', fontWeight: 300, marginTop: '6px' }}>{currentTime}</p>
                </div>

                {/* Main */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Icon */}
                    <div style={{ marginBottom: '1.5vh', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            inset: '-15px',
                            background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(20px)',
                        }} />
                        <div className="animate-float" style={{ position: 'relative' }}>
                            <WeatherIcon icon={weather.weatherIcon} size="lg" />
                        </div>
                    </div>

                    {/* Temperature */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5vh' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '80px', fontWeight: 200, color: 'white', lineHeight: 1, letterSpacing: '-3px' }}>
                                {weather.temperature}
                            </span>
                            <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.35)', fontWeight: 300, marginTop: '10px', marginLeft: '4px' }}>°C</span>
                        </div>

                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', fontWeight: 300, marginTop: '8px' }}>
                            {weather.weatherDescription}
                        </p>
                    </div>

                    {/* Feels Like */}
                    <div style={{
                        padding: '10px 20px',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.05)',
                    }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Feels like </span>
                        <span style={{ color: 'white', fontWeight: 500, fontSize: '18px' }}>{weather.feelsLike}°</span>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ width: '60%', margin: '1.5vh auto', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1vh 0.8vw' }}>
                    <StatCard icon="💧" label="Humidity" value={`${weather.humidity}%`} />
                    <StatCard icon="💨" label="Wind" value={`${weather.windSpeed} km/h`} />
                    <StatCard icon="🌡️" label="Pressure" value={`${weather.pressure}`} />
                    <StatCard icon="☀️" label="UV" value={getUVLabel(weather.uvIndex)} />
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div style={{
            padding: '12px 10px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.04)',
            textAlign: 'center',
        }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }}>{icon}</span>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</p>
            <p style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{value}</p>
        </div>
    );
}

function getUVLabel(uv: number): string {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Mod';
    if (uv <= 7) return 'High';
    return 'V.High';
}
