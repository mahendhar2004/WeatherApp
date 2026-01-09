'use client';

import { HourlyForecast as HourlyForecastType } from '@/lib/api';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
    hourly: HourlyForecastType[];
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
    const formatTime = (timeString: string, index: number) => {
        if (index === 0) return 'Now';
        const date = new Date(timeString);
        const hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12} ${ampm}`;
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '1.5vh 2vw',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <h2 style={{ color: 'white', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🕐</span>
                    Hourly Forecast
                </h2>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>Next 24 hours</span>
            </div>

            {/* Content */}
            <div style={{ padding: '1.8vh 2vw' }}>
                <div style={{ display: 'flex', gap: '1vw', overflowX: 'auto', paddingBottom: '0.5vh', paddingRight: '1vw' }} className="scrollbar-hide">
                    {hourly.slice(0, 24).map((hour, index) => (
                        <div
                            key={hour.time}
                            style={{
                                flexShrink: 0,
                                width: '70px',
                                padding: '1.5vh 8px',
                                borderRadius: '16px',
                                textAlign: 'center',
                                background: index === 0
                                    ? 'linear-gradient(180deg, rgba(139,92,246,0.35) 0%, rgba(236,72,153,0.2) 100%)'
                                    : 'rgba(255,255,255,0.03)',
                                border: index === 0 ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent',
                            }}
                        >
                            <p style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                marginBottom: '10px',
                                color: index === 0 ? 'rgb(196,181,253)' : 'rgba(255,255,255,0.5)',
                            }}>
                                {formatTime(hour.time, index)}
                            </p>

                            <div style={{ marginBottom: '10px' }}>
                                <WeatherIcon icon={hour.weatherIcon} size="xs" />
                            </div>

                            <p style={{
                                fontWeight: 700,
                                fontSize: '16px',
                                color: index === 0 ? 'white' : 'rgba(255,255,255,0.85)',
                            }}>
                                {hour.temperature}°
                            </p>

                            {hour.precipitationProbability > 0 && (
                                <p style={{ color: 'rgba(147,197,253,0.9)', fontSize: '11px', marginTop: '8px', fontWeight: 500 }}>
                                    💧{hour.precipitationProbability}%
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
