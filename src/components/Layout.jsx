import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, activeTab, onTabChange, leagues }) => {
  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} leagues={leagues} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
