import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';

function page() {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header />
        <div className="p-4">
            <h1>Logout</h1>
        </div>
      </div>
    </div>
  )
}

export default page