"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/page';
import dynamic from 'next/dynamic';

// Dynamically import each section to improve load time and reduce static build issues.
const Dashboard = dynamic(() => import('./Body/Dashboard/page'), { ssr: false });
const Meals = dynamic(() => import('./Body/Meals/page'), { ssr: false });
const Orders = dynamic(() => import('./Body/Orders/page'), { ssr: false });
const Reports = dynamic(() => import('./Body/Reports_/page'), { ssr: false });
const Profile = dynamic(() => import('./Body/Profile/page'), { ssr: false });
const Cashier = dynamic(() => import('./Body/Cashier/page'), { ssr: false });

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
