import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Cloud, 
  Search, 
  Sun, 
  Calendar, 
  History, 
  Anchor, 
  MapPin,
  Thermometer
} from 'lucide-react';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Historical from './components/Historical';
import Marine from './components/Marine';
import Location from './components/Location';

const tabs = [
  { id: 'current', label: 'Current', icon: Sun, path: '/' },
  { id: 'forecast', label: 'Forecast', icon: Calendar, path: '/forecast' },
  { id: 'historical', label: 'Historical', icon: History, path: '/historical' },
  { id: 'marine', label: 'Marine', icon: Anchor, path: '/marine' },
  { id: 'location', label: 'Location', icon: MapPin, path: '/location' },
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocation, setActiveLocation] = useState('New York');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveLocation(searchQuery.trim());
      setSearchQuery('');
    }
  }, [searchQuery]);

  const activeTab = tabs.find(tab => tab.path === location.pathname)?.id || 'current';

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">
            <Cloud size={24} color="white" />
          </div>
          <div>
            <span className="app-logo-text">WeatherStack</span>
            <span className="app-logo-badge">Pro</span>
          </div>
        </div>

        {/* Search */}
        <form className="search-container" onSubmit={handleSearch}>
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="glass-input search-input"
              placeholder="Search city, zip code, or coordinates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="glass-btn glass-btn-primary">
            <Search size={16} />
            Search
          </button>
        </form>

        {/* Current Location Display */}
        <div className="glass-card-static" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Thermometer size={16} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Viewing: <strong style={{ color: 'var(--text-primary)' }}>{activeLocation}</strong>
          </span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs" style={{ marginBottom: '24px' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => navigate(tab.path)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CurrentWeather location={activeLocation} />} />
          <Route path="/forecast" element={<Forecast location={activeLocation} />} />
          <Route path="/historical" element={<Historical location={activeLocation} />} />
          <Route path="/marine" element={<Marine location={activeLocation} />} />
          <Route path="/location" element={<Location location={activeLocation} onLocationSelect={setActiveLocation} />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{ 
        marginTop: 'auto', 
        paddingTop: '32px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '13px'
      }}>
        <p>Powered by WeatherStack API</p>
      </footer>
    </div>
  );
}

export default App;
