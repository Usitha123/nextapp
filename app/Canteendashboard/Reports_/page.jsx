import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';
import ReportGenerate from './ReportGenerate';

function page() {
  return (
    <div className="flex bg-black">
      <Sidebar/>
      <div className="ml-20 md:ml-60 h-[100vh] w-[100vw]"> 
        <Topbar />
        <Header title="Reports"/>
        <div className="p-4">
            <ReportGenerate />
        </div>
      </div>
    </div>
  )
}

export default page