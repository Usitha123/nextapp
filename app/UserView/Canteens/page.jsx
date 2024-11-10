"use client";

import React from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';
import { usePathname } from 'next/navigation';
import CanteenCard from './CanteenCard';
import Link from 'next/link';


const canteensData = [
  { name: 'Open', path: '/UserView/Canteens/open', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/650c4415723ed7106fd81a28368555e3bb8d7c95e298ea855e0f0a39015a6d78?placeholderIfAbsent=true&apiKey=3a090c35a38648da8cfc2ac953d0528d' },
  { name: 'GYM', path: '/UserView/Canteens/gym', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/79aad3a8894ad07e96914035a8a20f9fd035a45f14d2178fbcd898975c0b83c4?placeholderIfAbsent=true&apiKey=3a090c35a38648da8cfc2ac953d0528d' },
  { name: 'Rahula', path: '/UserView/Canteens/rahula', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/80280da8f9b62b352711f8f0628f4416a42a940960556fef7bf229a5f016db9f?placeholderIfAbsent=true&apiKey=3a090c35a38648da8cfc2ac953d0528d' },
  { name: 'SkyCafe', path: '/UserView/Canteens/skycafe', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/cc5963a82bfb9163e51707842f649ef4a0bbd52f1f6d0b9405e8b2212c4248bb?placeholderIfAbsent=true&apiKey=3a090c35a38648da8cfc2ac953d0528d' },
  { name: 'Green', path: '/UserView/Canteens/green', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/650c4415723ed7106fd81a28368555e3bb8d7c95e298ea855e0f0a39015a6d78?placeholderIfAbsent=true&apiKey=3a090c35a38648da8cfc2ac953d0528d' },
  { name: 'GYM', path: '/UserView/Canteens/gym', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/79aad3a8894ad07e96914035a8a20f9fd035a45f14d2178fbcd898975c0b83c4?placeholderIfAbsent=true&apiKey=3a090c35a38648da8cfc2ac953d0528d' },
  { name: 'Rahula', path: '/UserView/Canteens/rahula', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/80280da8f9b62b352711f8f0628f4416a42a940960556fef7bf229a5f016db9f?placeholderIfAbsent=true&apiKey=3a090c35a38648da8cfc2ac953d0528d' },
  { name: 'SkyCafe', path: '/UserView/Canteens/skycafe', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/cc5963a82bfb9163e51707842f649ef4a0bbd52f1f6d0b9405e8b2212c4248bb?placeholderIfAbsent=true&apiKey=3a090c35a38648da8cfc2ac953d0528d' },
  ];


const Page = () => {
  const currentPath = usePathname();

  return (
    <div className="flex bg-gray-100">
      <div className='fixed '>      <Sidebar activePath={currentPath} /> {/* Pass current path as activePath */}
      </div>
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

