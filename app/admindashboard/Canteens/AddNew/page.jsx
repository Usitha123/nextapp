import React from 'react'
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import Addcanteens from './Addcanteens';

function page() {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header title="Add New" />
        <div className="p-4">
             <Addcanteens />
        </div>
      </div>
    </div>
  )
}

export default page