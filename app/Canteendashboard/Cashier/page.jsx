import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';
import Cashier from './Addowner';

function page() {
  return (
    <div className="flex bg-black">
      <Sidebar/>
<div className="ml-20 md:ml-60 min-h-screen w-full bg-black">
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