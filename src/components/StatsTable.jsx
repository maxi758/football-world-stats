import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchLeagues, fetchCups, fetchTopScorers } from '../services/api';
import './StatsTable.css';

const StatsTable = ({ type, data: propData }) => {
  const [data, setData] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(type !== 'single-league');
  const [scorersLoading, setScorersLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Reset data immediately when type/propData changes to avoid stale renders
    setData([]);
    setScorers([]);

    // If we're showing a single league passed via props, we don't need to fetch standings
    if (type === 'single-league' && propData) {
      setData([propData]);
      setLoading(false);

      // Fetch top scorers for this league
      setScorersLoading(true);
      fetchTopScorers(propData.id, 10)
        .then(setScorers)
        .finally(() => setScorersLoading(false));
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const result = type === 'leagues' ? await fetchLeagues() : await fetchCups();
        setData(result);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, propData]);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="stats-container">
        <header className="section-header">
          <h1>{type === 'cups' ? 'Cup Statistics' : 'League Standings'}</h1>
        </header>
        <div className="loading-state">Loading statistics...</div>
      </div>
    );
  }

  const renderLeagueContent = (item) => (
    <div className="table-wrapper">
    <table className="standings-table fa-fade-in">
      <thead>
        <tr>
          <th>#</th>
          <th>Team</th>
          <th>PL</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GD</th>
          <th>PTS</th>
        </tr>
      </thead>
      <tbody>
        {(item.standings ?? []).map((team) => (
          <tr key={team.rank}>
            <td className="rank">{team.rank}</td>
            <td className="team-cell">
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    {team.teamLogo && <img src={team.teamLogo} style={{width:'20px'}} alt="" />}
                    {team.team}
                </div>
            </td>
            <td>{team.played}</td>
            <td>{team.won}</td>
            <td>{team.draw}</td>
            <td>{team.lost}</td>
            <td>{team.gd}</td>
            <td className="points">{team.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );

  const renderTopScorers = () => {
    if (scorersLoading) {
      return <div className="loading-state scorers-loading">Loading top scorers…</div>;
    }
    if (!scorers.length) return null;

    return (
      <div className="scorers-section">
        <h2 className="scorers-title">⚽ Top Scorers</h2>
        <div className="table-wrapper">
          <table className="standings-table scorers-table fa-fade-in">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Team</th>
                <th title="Goals">G</th>
                <th title="Assists">A</th>
                <th title="Matches Played">MP</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((scorer) => (
                <tr key={scorer.rank}>
                  <td className="rank">{scorer.rank}</td>
                  <td className="team-cell" style={{fontWeight: 600}}>{scorer.name}</td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                      {scorer.teamLogo && <img src={scorer.teamLogo} style={{width:'18px'}} alt="" />}
                      {scorer.team}
                    </div>
                  </td>
                  <td className="points">{scorer.goals}</td>
                  <td>{scorer.assists}</td>
                  <td>{scorer.played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCupContent = (item) => (
    <div className="cup-content">
        {item.matches && item.matches.length > 0 ? (
            <div className="cup-matches">
            {item.matches.map((match, i) => (
                <div key={i} className="cup-match-row">
                <span className="home">{match.home}</span>
                <span className="vs">vs</span>
                <span className="away">{match.away}</span>
                <span className="date">{match.date}</span>
                </div>
            ))}
            </div>
        ) : item.groups && item.groups.length > 0 ? (
            <div className="groups-grid">
            {item.groups.map((group, i) => (
                <div key={i} className="group-box">
                <h4>{group.name}</h4>
                <ul>
                    {group.teams.map((team, j) => (
                    <li key={j}>{team}</li>
                    ))}
                </ul>
                </div>
            ))}
            </div>
        ) : (
            <div className="no-data">No data available.</div>
        )}
    </div>
  );

  return (
    <div className="stats-container">
      {type !== 'single-league' && (
      <header className="section-header">
        <h1>{type === 'cups' ? 'Cup Statistics' : 'League Standings'}</h1>
      </header>
      )}

      <div className="stats-grid">
        {data.map((item) => (
          <React.Fragment key={item.id}>
          <div className={`stats-card ${type === 'leagues' ? 'accordion-item' : ''}`}>

            {/* Header / Click Trigger - Only show if NOT single-league mode */}
            {type !== 'single-league' && (
            <div
                className={`card-header ${type === 'leagues' ? 'accordion-header' : ''} ${type === 'leagues' && expandedId === item.id ? 'active' : ''}`}
                onClick={() => type === 'leagues' && toggleAccordion(item.id)}
            >
              <div className="header-title">
                  {item.emblem && <img src={item.emblem} alt="" style={{width: '24px', marginRight:'8px'}} />}
                  <h3>{item.name}</h3>
                  {type === 'leagues' && (
                      <span className="accordion-icon">
                          {expandedId === item.id ? '−' : '+'}
                      </span>
                  )}
              </div>
              {item.stage && <span className="stage-badge">{item.stage}</span>}
            </div>
            )}

            {/* If Single League, we just show the header as a title block */}
            {type === 'single-league' && (
                <div className="card-header">
                    <div className="header-title">
                        {item.emblem && <img src={item.emblem} alt="" style={{width: '32px', marginRight:'12px'}} />}
                        <h3 style={{fontSize:'1.5rem'}}>{item.name}</h3>
                    </div>
                </div>
            )}

            {/* Content Body */}
            {type === 'leagues' ? (
                <div className={`accordion-content ${expandedId === item.id ? 'expanded' : ''}`}>
                    {expandedId === item.id && renderLeagueContent(item)}
                </div>
            ) : type === 'single-league' ? (
                <div style={{padding:'0'}}>
                    {renderLeagueContent(item)}
                </div>
            ) : (
                renderCupContent(item)
            )}
          </div>

          {/* Scorers rendered as a SEPARATE card below standings */}
          {type === 'single-league' && (
            <div className="stats-card scorers-card">
              {renderTopScorers()}
            </div>
          )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

StatsTable.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object,
};

export default StatsTable;
