'use client';

import { DailyForecast as DailyForecastType } from '@/lib/api';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
    daily: DailyForecastType[];
}

export function DailyForecast({ daily }: DailyForecastProps) {
    const allTemps = daily.flatMap(d => [d.temperatureMin, d.temperatureMax]);
    const weekMin = Math.min(...allTemps);
    const weekMax = Math.max(...allTemps);
    const tempRange = weekMax - weekMin || 1;

    return (
        <div style={{
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                padding: '1.5vh 2vw',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
            }}>
                <h2 style={{ color: 'white', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>📅</span>
                    7-Day Forecast
                </h2>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>This week</span>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '1vh 1.5vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
                {daily.map((day, index) => {
                    const leftPos = ((day.temperatureMin - weekMin) / tempRange) * 100;
                    const rightPos = ((weekMax - day.temperatureMax) / tempRange) * 100;

                    return (
                        <div
                            key={day.date}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.2vw',
                                padding: '0.8vh 1.2vw',
                                borderRadius: '12px',
                                background: index === 0
                                    ? 'linear-gradient(90deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.1) 50%, transparent 100%)'
                                    : 'rgba(255,255,255,0.02)',
                                border: index === 0 ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
                            }}
                        >
                            {/* Day */}
                            <div style={{ width: '50px', flexShrink: 0 }}>
                                <p style={{
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    color: index === 0 ? 'rgb(196,181,253)' : 'rgba(255,255,255,0.75)',
                                }}>
                                    {day.dayName}
                                </p>
                            </div>

                            {/* Icon */}
                            <div style={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                                <WeatherIcon icon={day.weatherIcon} size="xs" />
                            </div>

                            {/* Rain */}
                            <div style={{ width: '60px', flexShrink: 0, textAlign: 'center' }}>
                                {day.precipitationProbability > 0 ? (
                                    <span style={{ color: 'rgba(147,197,253,0.9)', fontSize: '13px', fontWeight: 500 }}>
                                        💧{day.precipitationProbability}%
                                    </span>
                                ) : (
                                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '13px' }}>—</span>
                                )}
                            </div>

                            {/* Temperature Bar */}
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.8vw', minWidth: 0, maxWidth: '100%' }}>
                                <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500, width: '36px', textAlign: 'right', flexShrink: 0, fontSize: '14px' }}>
                                    {day.temperatureMin}°
                                </span>

                                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', position: 'relative', overflow: 'hidden', minWidth: 0 }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        bottom: 0,
                                        left: `${leftPos}%`,
                                        right: `${rightPos}%`,
                                        background: 'linear-gradient(90deg, #60a5fa, #fbbf24, #f97316)',
                                        borderRadius: '4px',
                                    }} />
                                </div>

                                <span style={{ color: 'white', fontWeight: 700, width: '36px', flexShrink: 0, fontSize: '14px' }}>
                                    {day.temperatureMax}°
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
