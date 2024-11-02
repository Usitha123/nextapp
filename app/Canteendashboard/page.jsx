"use client"

import React, { useState } from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/page';
import Dashboard from './Body/Dashboard/page';
import Meals from './Body/Meals/page';
import Orders from './Body/Orders/page';
import Reports from './Body/Reports_/page';
import Profile from './Body/Profile/page';
import Cashier from './Body/Cashier/page';

export default function MainLayout() {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const renderBodyContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Meals':
        return <Meals />;
      case 'Orders':
        return <Orders />;
      case 'Reports':
        return <Reports />;
      case 'Cashier':
        return <Cashier />;
      case 'Profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSectionChange={setActiveSection} />
      <div className="flex-1">
        <Topbar />
        <Header section={activeSection} />
        <div className="p-4">
          {renderBodyContent()}
        </div>
      </div>
    </div>
  );
}
