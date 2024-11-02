import React from 'react';

export default function Header({ section }) {
  return (
    <div className="p-4 text-xl font-bold text-white bg-gray-600">
      {section}
    </div>
  );
}
