"use client";

import React from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';
import { usePathname } from 'next/navigation';
import CanteenCard from './CanteenCard';
import Link from 'next/link';
import { canteens_list } from '@/app/assets/assets';
import open from '../../assets/open.jpg'


const canteensData = [
  { name: 'Open', path: '/UserView/Canteens/open', image: open},
  { name: 'GYM', path: '/UserView/Canteens/gym', image: open },
  { name: 'Rahula', path: '/UserView/Canteens/rahula', image: open},
  { name: 'SkyCafe', path: '/UserView/Canteens/skycafe', image: open },
  { name: 'Green', path: '/UserView/Canteens/green', image: open},
  { name: 'GYM', path: '/UserView/Canteens/gym', image:open },
  { name: 'Rahula', path: '/UserView/Canteens/rahula', image: open },
  { name: 'SkyCafe', path: '/UserView/Canteens/skycafe', image: open },
  ];


const Page = () => {
  const currentPath = usePathname();

  return (
    <div className="flex bg-gray-100">
      <div className='fixed '>      <Sidebar activePath={currentPath} /> {/* Pass current path as activePath */} </div>
     
      <div className="flex-1 ml-20 md:ml-60">
        <Topbar />
        <Header title="Canteens" />     
        <div className=" max-h-[70%] m-5">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between gap-4">
                {canteensData.map((canteen, index) => (
                  <Link href={canteen.path} key={index}>
                  <CanteenCard name={canteen.name} image={canteen.image} />
                </Link>
                ))}
              </div>
            </div>        


        </div>
    </div>
   
  );
};

export default Page;

