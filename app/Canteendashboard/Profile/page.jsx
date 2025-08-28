import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';
import Profile from './Profile';

function page() {
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <div className="ml-20 md:ml-60 flex-1 flex flex-col bg-black"> 
        <Topbar />
        <Header title="Profile" />
        <div className="p-4">
           <Profile />
        </div>
      </div>
    </div>
  )
}

export default page