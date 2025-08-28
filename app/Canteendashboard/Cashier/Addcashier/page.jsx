import React from 'react'
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/Header';
import Cashier from './Addowner';

function page() {
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <div className="ml-20 md:ml-60 flex-1 flex flex-col bg-black"> 
        <Topbar />
        <Header title="Add Cashier" />
        <div className="p-4">
            <Cashier/>
        </div>
      </div>
    </div>
  )
}

export default page