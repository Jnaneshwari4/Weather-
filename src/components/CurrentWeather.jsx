import { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  CloudRain,
  Sun,
  CloudSun,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getCurrentWeather, formatWeatherData } from '../services/weatherApi';

function CurrentWeather({ location }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(location);
      setWeatherData(formatWeatherData(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  if (loading) {
    return (
      <div className="glass-card-static">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Fetching weather data for {location}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card-static">
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <h3 className="error-title">Unable to load weather data</h3>
          <p className="error-message">{error}</p>
          <button className="glass-btn glass-btn-primary" onClick={fetchWeather}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, location: loc } = weatherData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Card */}
      <div className="glass-card-static weather-hero">
        <div>
          <div className="weather-hero-main">
            {current.icon ? (
              <img src={current.icon} alt={current.description} className="weather-icon-lg" />
            ) : (
              <div style={{ 
                width: '96px', 
                height: '96px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px'
              }}>
                {current.isDay ? <Sun size={48} color="var(--accent-amber)" /> : <CloudSun size={48} color="var(--accent-blue)" />}
              </div>
            )}
            <div>
              <div className="weather-temp">
                {current.temperature}<span className="weather-temp-unit">°C</span>
              </div>
              <div className="weather-condition">{current.description}</div>
              <div className="weather-location">
                <span>{loc.name}, {loc.country}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Local time: {loc.localtime}
              </div>
            </div>
          </div>
        </div>
        
        <div className="weather-hero-stats">
          <div className="weather-hero-stat">
            <div className="weather-hero-stat-value">{current.feelsLike}°C</div>
            <div className="weather-hero-stat-label">Feels Like</div>
          </div>
          <div className="weather-hero-stat">
            <div className="weather-hero-stat-value">{current.humidity}%</div>
            <div className="weather-hero-stat-label">Humidity</div>
          </div>
          <div className="weather-hero-stat">
            <div className="weather-hero-stat-value">{current.windSpeed} km/h</div>
            <div className="weather-hero-stat-label">Wind Speed</div>
          </div>
          <div className="weather-hero-stat">
            <div className="weather-hero-stat-value">{current.uvIndex}</div>
            <div className="weather-hero-stat-label">UV Index</div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Weather Details</h2>
          <p className="section-subtitle">Comprehensive atmospheric conditions</p>
        </div>
        <button className="glass-btn" onClick={fetchWeather}>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="grid-4">
        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(245, 158, 11, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Thermometer size={20} color="var(--accent-rose)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Temperature</span>
          </div>
          <div className="stat-value">{current.temperature}<span className="stat-unit">°C</span></div>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Droplets size={20} color="var(--accent-blue)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Humidity</span>
          </div>
          <div className="stat-value">{current.humidity}<span className="stat-unit">%</span></div>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wind size={20} color="var(--accent-emerald)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Wind</span>
          </div>
          <div className="stat-value">{current.windSpeed}<span className="stat-unit">km/h {current.windDir}</span></div>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(244, 63, 94, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Gauge size={20} color="var(--accent-amber)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Pressure</span>
          </div>
          <div className="stat-value">{current.pressure}<span className="stat-unit">mb</span></div>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CloudRain size={20} color="var(--accent-cyan)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Precipitation</span>
          </div>
          <div className="stat-value">{current.precipitation}<span className="stat-unit">mm</span></div>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Eye size={20} color="var(--accent-blue)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Visibility</span>
          </div>
          <div className="stat-value">{current.visibility}<span className="stat-unit">km</span></div>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sun size={20} color="#8b5cf6" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>UV Index</span>
          </div>
          <div className="stat-value">
            {current.uvIndex}
            <span className="stat-unit">
              {current.uvIndex <= 2 ? ' Low' : current.uvIndex <= 5 ? ' Moderate' : current.uvIndex <= 7 ? ' High' : ' Very High'}
            </span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(156, 163, 175, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CloudSun size={20} color="#9ca3af" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Cloud Cover</span>
          </div>
          <div className="stat-value">{current.cloudCover}<span className="stat-unit">%</span></div>
        </div>
      </div>

      {/* Location Info */}
      <div className="glass-card-static" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Location Information
        </h3>
        <div className="grid-4" style={{ gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Region</div>
            <div style={{ fontSize: '14px' }}>{loc.region || 'N/A'}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Timezone</div>
            <div style={{ fontSize: '14px' }}>{loc.timezone || 'N/A'}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Latitude</div>
            <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>{loc.lat}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Longitude</div>
            <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>{loc.lon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
