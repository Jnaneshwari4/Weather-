import { useState, useEffect } from 'react';
import { 
  History,
  AlertCircle,
  RefreshCw,
  Calendar,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Lock,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { getHistoricalWeather } from '../services/weatherApi';
import { format, subDays, parseISO } from 'date-fns';

function Historical({ location }) {
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));

  const fetchHistorical = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistoricalWeather(location, selectedDate);
      setHistoricalData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorical();
  }, [location, selectedDate]);

  // Mock historical data for demonstration
  const mockHistoricalData = {
    date: selectedDate,
    avgTemp: 22,
    maxTemp: 26,
    minTemp: 18,
    humidity: 65,
    precipitation: 2.5,
    windSpeed: 15,
    condition: 'Partly Cloudy',
    hourlyData: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      temp: Math.round(18 + Math.sin((i - 6) * Math.PI / 12) * 8),
      humidity: Math.round(60 + Math.cos((i - 12) * Math.PI / 12) * 20),
      windSpeed: Math.round(10 + Math.random() * 10),
    })),
  };

  // Generate last 30 days for quick selection
  const recentDates = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i + 1);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'MMM d'),
    };
  });

  const isPaidFeature = error && (error.includes('requires') || error.includes('101'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Historical Weather</h2>
          <p className="section-subtitle">Past weather data for {location}</p>
        </div>
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Date:</label>
            <input
              type="date"
              className="date-input"
              value={selectedDate}
              max={format(subDays(new Date(), 1), 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button className="glass-btn" onClick={fetchHistorical}>
            <RefreshCw size={14} />
            Fetch
          </button>
        </div>
      </div>

      {/* Quick Date Selection */}
      <div className="glass-card-static" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Quick select:</span>
          {recentDates.slice(0, 10).map((date) => (
            <button
              key={date.value}
              className={`glass-btn ${selectedDate === date.value ? 'glass-btn-primary' : ''}`}
              style={{ padding: '8px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedDate(date.value)}
            >
              {date.label}
            </button>
          ))}
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
              Historical data requires a paid WeatherStack plan. Showing demo data below.
            </p>
          </div>
          <span className="badge badge-warning">Paid Plan</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid-4">
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
              <Thermometer size={20} color="var(--accent-blue)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Avg Temp</span>
          </div>
          <div className="stat-value">{mockHistoricalData.avgTemp}<span className="stat-unit">°C</span></div>
        </div>

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
              <TrendingUp size={20} color="var(--accent-rose)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Max Temp</span>
          </div>
          <div className="stat-value">{mockHistoricalData.maxTemp}<span className="stat-unit">°C</span></div>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(16, 185, 129, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingDown size={20} color="var(--accent-cyan)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Min Temp</span>
          </div>
          <div className="stat-value">{mockHistoricalData.minTemp}<span className="stat-unit">°C</span></div>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Droplets size={20} color="var(--accent-blue)" />
            </div>
            <span className="stat-label" style={{ margin: 0 }}>Precipitation</span>
          </div>
          <div className="stat-value">{mockHistoricalData.precipitation}<span className="stat-unit">mm</span></div>
        </div>
      </div>

      {/* Hourly Data Table */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Hourly Data</h2>
          <p className="section-subtitle">Hour-by-hour breakdown for {format(parseISO(selectedDate), 'MMMM d, yyyy')}</p>
        </div>
      </div>

      <div className="glass-card-static" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Wind Speed</th>
                <th>Conditions</th>
              </tr>
            </thead>
            <tbody>
              {mockHistoricalData.hourlyData.filter((_, i) => i % 3 === 0).map((hour) => (
                <tr key={hour.hour}>
                  <td style={{ fontWeight: '500' }}>
                    {String(hour.hour).padStart(2, '0')}:00
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Thermometer size={14} color="var(--accent-rose)" />
                      {hour.temp}°C
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Droplets size={14} color="var(--accent-blue)" />
                      {hour.humidity}%
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wind size={14} color="var(--accent-emerald)" />
                      {hour.windSpeed} km/h
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {hour.hour >= 6 && hour.hour <= 18 ? 'Clear' : 'Clear Night'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Card */}
      <div className="glass-card-static" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Compare with Today</h3>
        <div className="grid-3">
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Temperature Difference</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: '600' }}>+2°C</span>
              <TrendingUp size={20} color="var(--accent-rose)" />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Warmer than selected date</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Humidity Difference</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: '600' }}>-5%</span>
              <TrendingDown size={20} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Drier than selected date</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Similar Conditions</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sun size={24} color="var(--accent-amber)" />
              <ArrowRight size={16} color="var(--text-muted)" />
              <Sun size={24} color="var(--accent-amber)" />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Both days sunny</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historical;
