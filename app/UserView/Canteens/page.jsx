"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';
import { usePathname } from 'next/navigation';
import CanteenCard from './CanteenCard';
import Link from 'next/link';

const Page = () => {
  const currentPath = usePathname();

  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch canteen data
    const fetchCanteens = async () => {
      try {
        const res = await fetch('/api/allcanteenslist');
        const data = await res.json();
        setCanteens(data);
      } catch (error) {
        console.error('Error fetching canteens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-gray-100">
      <div className='fixed'>
        <Sidebar activePath={currentPath} /> {/* Pass current path as activePath */}
      </div>
      <div className="flex-1 ml-20 md:ml-60">
        <Topbar />
        <Header title="Canteens" />     
        <div className="max-h-[70%] m-5">
          <div className="grid justify-between w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {canteens.map((canteen, index) => (
              <Link key={index} href={`/canteen/${canteen._id}`}>
                <CanteenCard name={canteen.canteenName} image={canteen.image} />
              </Link>
            ))}
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Page;
