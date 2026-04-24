import React, { useState, useEffect } from 'react';
import { fetchLiveMatches } from '../services/api';
import './LiveResults.css';

const LiveResults = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveMatches();
      setMatches(data);
      setError(null);
    } catch (err) {
      setError('Failed to load live matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
    // Poll every 60 seconds
    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-results-container">
      <header className="section-header">
        <h1>Live Results</h1>
        <div className="header-actions">
          <span className="live-indicator">● LIVE NOW</span>
          <button className="refresh-btn" onClick={loadMatches} disabled={loading}>
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>
      </header>
      
      {loading && matches.length === 0 ? (
        <div className="loading-state">Loading live scores...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : matches.length === 0 ? (
        <div className="empty-state">No live matches at the moment.</div>
      ) : (
        <div className="matches-grid">
          {matches.map((match) => (
            <div key={match.id} className="match-card">
              <div className="match-header">
                <span className="league-name">{match.league}</span>
                <span className="match-time">{match.time}</span>
              </div>
              
              <div className="teams-container">
                <div className="team home">
                  <span className="team-name">{match.homeTeam}</span>
                  <span className="score">{match.homeScore}</span>
                </div>
                <div className="team away">
                  <span className="team-name">{match.awayTeam}</span>
                  <span className="score">{match.awayScore}</span>
                </div>
              </div>
              
              <div className="match-footer">
                <span className="status">{match.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveResults;
