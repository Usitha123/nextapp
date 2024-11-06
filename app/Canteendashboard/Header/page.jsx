// Header/page.js
"use client";

import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="p-4 text-xl font-bold text-white bg-gray-600">
      {title}
    </header>
  );
};

export default Header;
