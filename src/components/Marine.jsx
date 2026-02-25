import { useState, useEffect } from 'react';
import { 
  Anchor,
  Waves,
  Wind,
  Thermometer,
  Compass,
  AlertCircle,
  RefreshCw,
  Lock,
  Navigation,
  Droplets,
  Eye,
  Timer,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getMarineWeather } from '../services/weatherApi';

function Marine({ location }) {
  const [marineData, setMarineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarine = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarineWeather(location);
      setMarineData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarine();
  }, [location]);

  // Mock marine data for demonstration
  const mockMarineData = {
    location: location,
    waterTemp: 18,
    waveHeight: 1.5,
    wavePeriod: 8,
    waveDirection: 'SW',
    swellHeight: 1.2,
    swellPeriod: 12,
    swellDirection: 'W',
    windSpeed: 22,
    windDirection: 'WSW',
    windGust: 28,
    visibility: 15,
    uvIndex: 6,
    tideStatus: 'Rising',
    nextHighTide: '14:32',
    nextLowTide: '20:45',
  };

  const isPaidFeature = error && (error.includes('requires') || error.includes('Business') || error.includes('101'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Marine Weather</h2>
          <p className="section-subtitle">Ocean and coastal conditions for {location}</p>
        </div>
        <button className="glass-btn" onClick={fetchMarine}>
          <RefreshCw size={14} />
          Refresh
        </button>
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
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Business Feature</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Marine weather data requires a Business WeatherStack plan. Showing demo data below.
            </p>
          </div>
          <span className="badge badge-warning">Business Plan</span>
        </div>
      )}

      {/* Main Marine Stats */}
      <div className="grid-4">
        <div className="glass-card marine-stat">
          <div className="marine-stat-icon">
            <Thermometer size={24} />
          </div>
          <div className="marine-stat-content">
            <div className="marine-stat-value">{mockMarineData.waterTemp}°C</div>
            <div className="marine-stat-label">Water Temperature</div>
          </div>
        </div>

        <div className="glass-card marine-stat">
          <div className="marine-stat-icon" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))' }}>
            <Waves size={24} />
          </div>
          <div className="marine-stat-content">
            <div className="marine-stat-value">{mockMarineData.waveHeight}m</div>
            <div className="marine-stat-label">Wave Height</div>
          </div>
        </div>

        <div className="glass-card marine-stat">
          <div className="marine-stat-icon" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))' }}>
            <Wind size={24} />
          </div>
          <div className="marine-stat-content">
            <div className="marine-stat-value">{mockMarineData.windSpeed} km/h</div>
            <div className="marine-stat-label">Wind Speed</div>
          </div>
        </div>

        <div className="glass-card marine-stat">
          <div className="marine-stat-icon" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(244, 63, 94, 0.2))' }}>
            <Eye size={24} />
          </div>
          <div className="marine-stat-content">
            <div className="marine-stat-value">{mockMarineData.visibility} km</div>
            <div className="marine-stat-label">Visibility</div>
          </div>
        </div>
      </div>

      {/* Wave & Swell Conditions */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Wave & Swell Conditions</h2>
          <p className="section-subtitle">Detailed ocean surface data</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card-static" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Waves size={18} color="var(--accent-blue)" />
            Wave Data
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Height</div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>{mockMarineData.waveHeight}m</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Period</div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>{mockMarineData.wavePeriod}s</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Direction</div>
              <div style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={16} style={{ transform: 'rotate(225deg)' }} />
                {mockMarineData.waveDirection}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card-static" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Anchor size={18} color="var(--accent-cyan)" />
            Swell Data
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Height</div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>{mockMarineData.swellHeight}m</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Period</div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>{mockMarineData.swellPeriod}s</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Direction</div>
              <div style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={16} style={{ transform: 'rotate(270deg)' }} />
                {mockMarineData.swellDirection}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wind & Tide */}
      <div className="grid-2">
        <div className="glass-card-static" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind size={18} color="var(--accent-emerald)" />
            Wind Conditions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Speed</div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>{mockMarineData.windSpeed} km/h</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Gusts</div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>{mockMarineData.windGust} km/h</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Direction</div>
              <div style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Compass size={16} />
                {mockMarineData.windDirection}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card-static" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Timer size={18} color="var(--accent-amber)" />
            Tide Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</div>
              <div style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={16} color="var(--accent-emerald)" />
                {mockMarineData.tideStatus}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Next High</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>{mockMarineData.nextHighTide}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Next Low</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>{mockMarineData.nextLowTide}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Conditions */}
      <div className="glass-card-static" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>Marine Safety Assessment</h3>
        <div className="grid-4">
          <div style={{ 
            padding: '16px', 
            background: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', marginBottom: '4px' }}>Swimming</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>Safe</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Calm conditions</div>
          </div>
          <div style={{ 
            padding: '16px', 
            background: 'rgba(245, 158, 11, 0.1)', 
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-amber)', marginBottom: '4px' }}>Surfing</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>Moderate</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Good swells</div>
          </div>
          <div style={{ 
            padding: '16px', 
            background: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', marginBottom: '4px' }}>Boating</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>Good</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Light winds</div>
          </div>
          <div style={{ 
            padding: '16px', 
            background: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', marginBottom: '4px' }}>Fishing</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>Excellent</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Good visibility</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marine;
