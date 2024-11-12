import React from 'react';
import { IoMdSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between p-4 text-white bg-gray-700">
      <span>Hi Dunith, Welcome Back</span>
      <div className="flex space-x-4">
      <IoMdSettings /> {/* Settings Icon Placeholder */}
      <FaUserAlt /> {/* Profile Icon Placeholder */}
      </div>
    </div>
  );
};

export default Topbar;
