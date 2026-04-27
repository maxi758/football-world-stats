import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LiveResults from './components/LiveResults';
import StatsTable from './components/StatsTable';
import { fetchLeagues } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('live');
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leaguesLoading, setLeaguesLoading] = useState(true);

  useEffect(() => {
    const loadLeagues = async () => {
      setLeaguesLoading(true);
      const data = await fetchLeagues();
      setLeagues(data);
      setLeaguesLoading(false);
    };
    loadLeagues();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // If tabId is a league ID (e.g. 'PL'), find and set selected league
    const league = leagues.find(l => l.id === tabId);
    if (league) {
        setSelectedLeague(league);
    } else {
        setSelectedLeague(null);
    }
  };

  const renderContent = () => {
    if (activeTab === 'live') return <LiveResults />;
    if (activeTab === 'cups') return <StatsTable type="cups" />;
    
    // If activeTab matches a league ID
    if (selectedLeague) {
        return <StatsTable type="single-league" data={selectedLeague} />;
    }

    return <LiveResults />;
  };

  return (
    <Layout 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        leagues={leagues}
        leaguesLoading={leaguesLoading}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
