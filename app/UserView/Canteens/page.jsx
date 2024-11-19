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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const res = await fetch('/api/allcanteenslist', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch data');
        
        const data = await res.json();
        
        const activeCanteens = data.filter(canteen => canteen.ownerstatus !== 'Inactive' && canteen.status == 'Active');
        setCanteens(activeCanteens);
      } catch (error) {
        console.error('Error fetching canteens:', error);
        setError('Failed to load canteens.');
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="fixed">
        <Sidebar activePath={currentPath} />
      </div>
      <div className="flex-1 ml-20 md:ml-60">
        <Topbar />
        <Header title="Canteens" />     
        <div className="max-h-[70%] m-5">
          <div className="grid justify-between w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {canteens.map((canteen, index) => (
              <Link key={index} href={`/UserView/Canteens/${canteen.canteenName}`}>
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
