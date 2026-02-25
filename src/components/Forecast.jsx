import { useState, useEffect } from 'react';
import { 
  Calendar,
  AlertCircle,
  RefreshCw,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Lock
} from 'lucide-react';
import { getForecastWeather } from '../services/weatherApi';

function Forecast({ location }) {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getForecastWeather(location, days);
      setForecastData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [location, days]);

  // Mock data for demonstration since forecast requires paid plan
  const mockForecast = [
    { day: 'Today', high: 24, low: 18, condition: 'Partly Cloudy', icon: 'cloud-sun', precip: 10 },
    { day: 'Tomorrow', high: 26, low: 19, condition: 'Sunny', icon: 'sun', precip: 0 },
    { day: 'Wednesday', high: 23, low: 17, condition: 'Cloudy', icon: 'cloud', precip: 20 },
    { day: 'Thursday', high: 21, low: 16, condition: 'Light Rain', icon: 'cloud-rain', precip: 60 },
    { day: 'Friday', high: 22, low: 15, condition: 'Partly Cloudy', icon: 'cloud-sun', precip: 15 },
    { day: 'Saturday', high: 25, low: 18, condition: 'Sunny', icon: 'sun', precip: 5 },
    { day: 'Sunday', high: 27, low: 20, condition: 'Sunny', icon: 'sun', precip: 0 },
  ];

  const getWeatherIcon = (iconType, size = 24) => {
    const iconProps = { size, strokeWidth: 1.5 };
    switch (iconType) {
      case 'sun': return <Sun {...iconProps} color="var(--accent-amber)" />;
      case 'cloud': return <Cloud {...iconProps} color="var(--text-secondary)" />;
      case 'cloud-sun': return <Sun {...iconProps} color="var(--accent-amber)" />;
      case 'cloud-rain': return <CloudRain {...iconProps} color="var(--accent-blue)" />;
      case 'snow': return <Snowflake {...iconProps} color="var(--accent-cyan)" />;
      case 'thunderstorm': return <CloudLightning {...iconProps} color="var(--accent-amber)" />;
      case 'fog': return <CloudFog {...iconProps} color="var(--text-muted)" />;
      default: return <Sun {...iconProps} color="var(--accent-amber)" />;
    }
  };

  const isPaidFeature = error && error.includes('requires');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Weather Forecast</h2>
          <p className="section-subtitle">{days}-day forecast for {location}</p>
        </div>
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Days:</label>
            <select 
              className="glass-select" 
              value={days} 
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ minWidth: '100px' }}
            >
              <option value={3}>3 Days</option>
              <option value={5}>5 Days</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
            </select>
          </div>
          <button className="glass-btn" onClick={fetchForecast}>
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Notice Card for API limitations */}
      {(isPaidFeature || error) && (
        <div className="glass-card-static" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(244, 63, 94, 0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={24} color="var(--accent-amber)" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Premium Feature</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Forecast data requires a paid WeatherStack plan. Showing demo data below.
            </p>
          </div>
          <span className="badge badge-warning">Paid Plan</span>
        </div>
      )}

      {/* Forecast Cards */}
      <div className="glass-card-static" style={{ padding: '24px' }}>
        <div className="forecast-list">
          {mockForecast.slice(0, days).map((day, index) => (
            <div key={index} className="forecast-item">
              <div className="forecast-day">{day.day}</div>
              <div className="forecast-icon">
                {getWeatherIcon(day.icon, 32)}
              </div>
              <div className="forecast-condition">{day.condition}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '24px' }}>
                <Droplets size={14} color="var(--accent-blue)" />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{day.precip}%</span>
              </div>
              <div className="forecast-temps">
                <span className="forecast-high">{day.high}°</span>
                <span className="forecast-low">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Forecast Preview */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Hourly Breakdown</h2>
          <p className="section-subtitle">Temperature trends throughout the day</p>
        </div>
      </div>

      <div className="glass-card-static" style={{ padding: '24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '16px', minWidth: 'max-content' }}>
          {Array.from({ length: 12 }, (_, i) => {
            const hour = (8 + i * 2) % 24;
            const temp = Math.round(20 + Math.sin((hour - 6) * Math.PI / 12) * 6);
            const isNow = i === 2;
            return (
              <div 
                key={i} 
                style={{ 
                  textAlign: 'center', 
                  padding: '16px 12px',
                  background: isNow ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  borderRadius: '12px',
                  minWidth: '70px'
                }}
              >
                <div style={{ fontSize: '12px', color: isNow ? 'var(--accent-blue)' : 'var(--text-muted)', marginBottom: '8px' }}>
                  {isNow ? 'Now' : `${hour}:00`}
                </div>
                {getWeatherIcon(hour >= 6 && hour <= 18 ? 'sun' : 'cloud', 28)}
                <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '8px' }}>{temp}°</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
                  <Wind size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{8 + i}km/h</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid-3">
        <div className="glass-card stat-card">
          <div className="stat-label">Week High</div>
          <div className="stat-value">27<span className="stat-unit">°C</span></div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Sunday</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Week Low</div>
          <div className="stat-value">15<span className="stat-unit">°C</span></div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Friday</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Avg. Precipitation</div>
          <div className="stat-value">16<span className="stat-unit">%</span></div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>This Week</div>
        </div>
      </div>
    </div>
  );
}

export default Forecast;
