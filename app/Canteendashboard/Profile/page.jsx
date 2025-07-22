import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';
import Profile from './Profile';

function page() {
  return (
    <div className="flex bg-black">
      <Sidebar/>
      <div className="ml-20 md:ml-60 h-[100vh] w-[100vw]"> 
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