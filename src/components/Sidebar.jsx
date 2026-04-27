import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, onTabChange, leagues = [], leaguesLoading = false }) => {
  const [leaguesOpen, setLeaguesOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    onTabChange(id);
    setMobileOpen(false); // Close drawer on mobile after selection
  };

  return (
    <>
      {/* Hamburger button — only visible on small screens */}
      <button
        className={`hamburger ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Overlay — closes sidebar when tapping outside */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="logo">
          <h2>FootStats</h2>
        </div>
        <nav className="nav-menu">
          <ul>
            {/* Live Results */}
            <li
              className={`nav-item ${activeTab === 'live' ? 'active' : ''}`}
              onClick={() => handleNav('live')}
            >
              <span className="icon live-icon">●</span>
              <span className="label">Live Results</span>
            </li>

            {/* Leagues Section (Collapsible) */}
            <li className="nav-section">
              <div
                className="nav-item section-header"
                onClick={() => setLeaguesOpen(!leaguesOpen)}
              >
                <span className="icon">🏆</span>
                <span className="label">Leagues</span>
                <span className="arrow">{leaguesOpen ? '▼' : '▶'}</span>
              </div>

              {leaguesOpen && (
                <ul className="sub-menu">
                  {leagues.map(league => (
                    <li
                      key={league.id}
                      className={`nav-item sub-item ${activeTab === league.id ? 'active' : ''}`}
                      onClick={() => handleNav(league.id)}
                    >
                      {league.emblem ? (
                        <img src={league.emblem} alt={league.name} className="league-flag-icon" />
                      ) : (
                        <span className="icon-placeholder">•</span>
                      )}
                      <span className="label">{league.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Cups */}
            <li
              className={`nav-item ${activeTab === 'cups' ? 'active' : ''}`}
              onClick={() => handleNav('cups')}
            >
              <span className="icon">🌍</span>
              <span className="label">Cups</span>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
