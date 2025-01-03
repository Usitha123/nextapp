import React from 'react'
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import Profile from './Profile';

function page() {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1">
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