import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, activeTab, onTabChange, leagues, leaguesLoading }) => {
  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} leagues={leagues} leaguesLoading={leaguesLoading} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
