import React from 'react'
import Sidebar from '../../Sidebar/Sidebar';
import Topbar from '../../Topbar/page';
import Header from '../../Header/Header';
import Addcanteens from './Addcanteens';

function page() {
  return (
    <div className="flex bg-black">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header title="Canteens" />
        <div className="p-4">
             <Addcanteens />
        </div>
      </div>
    </div>
  )
}

export default page