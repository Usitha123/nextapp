import React from 'react'
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import AllCanteens from './AllCanteens';

function page() {
  return (
    <div className="flex bg-black">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header title="Add New" />
        <div className="p-4">
             <AllCanteens />
        </div>
      </div>
    </div>
  )
}

export default page