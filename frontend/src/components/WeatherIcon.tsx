'use client';

interface WeatherIconProps {
    icon: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const iconMap: Record<string, string> = {
    'clear': '☀️',
    'clear-night': '🌙',
    'partly-cloudy': '⛅',
    'partly-cloudy-night': '☁️',
    'cloudy': '☁️',
    'cloudy-night': '☁️',
    'fog': '🌫️',
    'fog-night': '🌫️',
    'drizzle': '🌧️',
    'drizzle-night': '🌧️',
    'rain': '🌧️',
    'rain-night': '🌧️',
    'rain-heavy': '🌧️',
    'rain-heavy-night': '🌧️',
    'sleet': '🌨️',
    'sleet-night': '🌨️',
    'snow': '❄️',
    'snow-night': '❄️',
    'snow-heavy': '❄️',
    'snow-heavy-night': '❄️',
    'thunderstorm': '⛈️',
    'thunderstorm-night': '⛈️',
};

// Increased sizes
const sizeMap = {
    xs: '28px',   // Was 24px
    sm: '36px',   // Was 32px  
    md: '48px',   // Was 44px
    lg: '72px',   // Was 56px
    xl: '90px',   // Was 70px
};

export function WeatherIcon({ icon, size = 'md' }: WeatherIconProps) {
    const emoji = iconMap[icon] || '☀️';

    return (
        <span style={{ fontSize: sizeMap[size], display: 'block', lineHeight: 1 }}>
            {emoji}
        </span>
    );
}
