import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';
import Orderlist from './Orderslist';


function page() {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header title="Orders" />
        <div className="p-4">
        <Orderlist/>
        </div>
      </div>
    </div>
  )
}

export default page