// Header/page.js
"use client";

import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="p-4 text-2xl text-[#ff842f] font-bold m-4 bg-white border-[2px] border-[#ff842f] rounded-xl ">
      {title}
    </header>
  );
};

export default Header;
