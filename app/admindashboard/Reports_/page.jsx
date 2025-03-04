import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';
import ReportGenerate from './ReportGenerate';

function page() {
  return (
    <div className="flex bg-black">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header title="Reports"/>
        <div className="p-1 px-2">
        <ReportGenerate />
        </div>
      </div>
    </div>
  )
}

export default page