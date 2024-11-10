import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';
import ImageUpload from '../../../components/ImageUpload'

function page() {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header title="Orders" />
        <div className="p-4">
        <ImageUpload />
        </div>
      </div>
    </div>
  )
}

export default page