import React from 'react';

const Topbar = () => {
  return (
    <div className="flex items-center justify-between p-4 text-white bg-gray-700">
      <span>Hi Dunith, Welcome Back</span>
      <div className="flex space-x-4">
        <span>⚙️</span> {/* Settings Icon Placeholder */}
        <span>👤</span> {/* Profile Icon Placeholder */}
      </div>
    </div>
  );
};

export default Topbar;
