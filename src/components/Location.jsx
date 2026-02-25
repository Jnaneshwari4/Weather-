import { useState, useEffect } from 'react';
import { 
  MapPin,
  Search,
  Globe,
  Clock,
  Navigation,
  RefreshCw,
  ChevronRight,
  Star,
  Trash2,
  Plus,
  AlertCircle,
  Lock
} from 'lucide-react';
import { lookupLocation, getCurrentWeather } from '../services/weatherApi';

function Location({ location, onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('savedLocations');
    return saved ? JSON.parse(saved) : [
      { name: 'New York', country: 'United States', lat: 40.71, lon: -74.01 },
      { name: 'London', country: 'United Kingdom', lat: 51.51, lon: -0.13 },
      { name: 'Tokyo', country: 'Japan', lat: 35.69, lon: 139.69 },
    ];
  });
  const [locationDetails, setLocationDetails] = useState(null);

  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  useEffect(() => {
    fetchLocationDetails();
  }, [location]);

  const fetchLocationDetails = async () => {
    try {
      const data = await getCurrentWeather(location);
      if (data && data.location) {
        setLocationDetails(data.location);
      }
    } catch (err) {
      // Silently fail for location details
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await lookupLocation(searchQuery);
      if (data && data.results) {
        setSearchResults(data.results);
      } else {
        // Simulate search results for demo since autocomplete requires paid plan
        setSearchResults([
          { name: searchQuery, country: 'Search Result', region: 'Demo', lat: 0, lon: 0 }
        ]);
      }
    } catch (err) {
      // Provide mock results when API fails
      setSearchResults([
        { name: searchQuery, country: 'Searched Location', region: '', lat: 0, lon: 0 }
      ]);
      setError('Autocomplete requires a paid plan. Showing basic search.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (loc) => {
    onLocationSelect(loc.name);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSaveLocation = (loc) => {
    const exists = savedLocations.some(
      s => s.name.toLowerCase() === loc.name.toLowerCase()
    );
    if (!exists) {
      setSavedLocations([...savedLocations, loc]);
    }
  };

  const handleRemoveLocation = (index) => {
    setSavedLocations(savedLocations.filter((_, i) => i !== index));
  };

  const isPaidFeature = error && (error.includes('requires') || error.includes('101'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Location Lookup</h2>
          <p className="section-subtitle">Search and manage your weather locations</p>
        </div>
      </div>

      {/* Current Location Card */}
      {locationDetails && (
        <div className="glass-card-static location-card">
          <div className="location-icon">
            <MapPin size={24} />
          </div>
          <div className="location-info">
            <div className="location-name">{locationDetails.name}</div>
            <div className="location-details">
              {locationDetails.region && `${locationDetails.region}, `}{locationDetails.country}
            </div>
            <div className="location-coords">
              {locationDetails.lat}, {locationDetails.lon}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Local Time</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>{locationDetails.localtime}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {locationDetails.timezone_id}
            </div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="glass-card-static" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} />
          Search Location
        </h3>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Globe size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="glass-input"
              style={{ paddingLeft: '44px' }}
              placeholder="Enter city name, zip code, or coordinates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="glass-btn glass-btn-primary" disabled={loading}>
            {loading ? <RefreshCw size={16} className="loading-spinner" style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
            Search
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Search Results
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onClick={() => handleSelectLocation(result)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <MapPin size={18} color="var(--accent-blue)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>{result.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {result.region && `${result.region}, `}{result.country}
                    </div>
                  </div>
                  <button
                    className="glass-btn"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveLocation(result);
                    }}
                  >
                    <Plus size={14} />
                    Save
                  </button>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lock size={16} color="var(--accent-amber)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{error}</span>
          </div>
        )}
      </div>

      {/* Saved Locations */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Saved Locations</h2>
          <p className="section-subtitle">Quick access to your favorite locations</p>
        </div>
      </div>

      <div className="grid-3">
        {savedLocations.map((loc, index) => (
          <div key={index} className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onLocationSelect(loc.name)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={20} color="var(--accent-blue)" />
              </div>
              <button
                className="glass-btn"
                style={{ padding: '6px', background: 'rgba(244, 63, 94, 0.1)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLocation(index);
                }}
              >
                <Trash2 size={14} color="var(--accent-rose)" />
              </button>
            </div>
            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{loc.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{loc.country}</div>
            {loc.lat && loc.lon && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'monospace' }}>
                {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}
              </div>
            )}
          </div>
        ))}

        {/* Add New Location Card */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '2px dashed rgba(255,255,255,0.1)',
            background: 'transparent',
            minHeight: '140px'
          }}
          onClick={() => document.querySelector('input[type="text"]').focus()}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Plus size={24} color="var(--text-muted)" />
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Add Location</div>
        </div>
      </div>

      {/* Popular Locations */}
      <div className="glass-card-static" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Popular Locations</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['Bangalore', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Los Angeles', 'Berlin', 'Mumbai', 'Toronto', 'Seoul', 'Mexico City'].map((city) => (
            <button
              key={city}
              className="glass-btn"
              style={{ padding: '8px 16px', fontSize: '13px' }}
              onClick={() => onLocationSelect(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Location Details */}
      {locationDetails && (
        <div className="glass-card-static" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Location Details</h3>
          <div className="grid-4" style={{ gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={12} />
                Country
              </div>
              <div style={{ fontSize: '14px' }}>{locationDetails.country}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={12} />
                Region
              </div>
              <div style={{ fontSize: '14px' }}>{locationDetails.region || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={12} />
                Timezone
              </div>
              <div style={{ fontSize: '14px' }}>{locationDetails.timezone_id}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Navigation size={12} />
                UTC Offset
              </div>
              <div style={{ fontSize: '14px' }}>{locationDetails.utc_offset}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Location;
