import React from 'react'
import Sidebar from '../../Sidebar/Sidebar';
import Topbar from '../../Topbar/page';
import Header from '../../Header/Header';
import UpdateCanteens from './UpdateCanteens';

function page() {
  return (
    <div className="flex bg-black">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header title="Update Canteen" />
        <div className="p-4">
             <UpdateCanteens />
        </div>
      </div>
    </div>
  )
}

export default page