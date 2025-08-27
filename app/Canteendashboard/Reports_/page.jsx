import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';
import ReportGenerate from './ReportGenerate';

function Page() {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex flex-col w-full h-screen ml-20 md:ml-60">
        {/* Fixed Topbar + Header */}
        <div className="fixed top-0 right-0 z-50 bg-black left-20 md:left-60">
          <Topbar />
          <Header title="Reports" />
        </div>

        {/* Scrollable Content */}
        <div className="mt-[120px] p-4 overflow-y-auto h-full">
          <ReportGenerate />
        </div>
      </div>
    </div>
  )
}

export default Page;
