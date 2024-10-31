"use client"

import React, { useState } from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/page';
import Body from './Body/page';
import CanteenList from './CanteenList/page';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex">
      <Sidebar onSelectSection={handleSectionChange} />
      <div className="flex flex-col flex-1">
        <Topbar />
        <Header />
        {activeSection === 'Dashboard' && <Body />}
        {activeSection === 'Canteens' && <CanteenList />}
      </div>
    </div>
  );
};

export default Dashboard;
