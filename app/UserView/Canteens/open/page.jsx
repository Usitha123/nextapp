// "use client";

// import React from 'react';
// import Sidebar from '../../Sidebar/page';
// import Topbar from '../../Topbar/page';
// import Header from '../../Header/page';
// import { usePathname } from 'next/navigation';
// import FoodDisplay from '../Food/FoodDisplay';

// const page = () => {

//   const currentPath = usePathname("/UserView/Canteens");

//   return (
//     <div className="flex bg-gray-100">
//       <div className='fixed '>      <Sidebar activePath={currentPath} /> {/* Pass current path as activePath */} </div>

//       <div className="flex-1 ml-20 md:ml-60">
//         <Topbar />
//         <Header title="Open canteen" />
//         <div className="p-4"></div>
//           <FoodDisplay/>
//       </div>
//       </div>
//   )
// }

// export default page
"use client";

import React from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import { usePathname } from 'next/navigation';
import FoodDisplay from '../Food/FoodDisplay';
import Cart from '../Cart/Cart'; // New Cart Component

const Page = () => {
  const currentPath = usePathname("/UserView/Canteens");

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="fixed">
        <Sidebar activePath={currentPath} />
      </div>

      <div className="flex-1 ml-20 md:ml-60 ">
      <Topbar />
      
        <Header title="Open Canteen" />
        
        {/* Tabs for meal categories */}
        <div className="flex flex-wrap"></div>
        <div className="flex px-3 space-x-4  m-2  font-semibold">
          <button className="hover:underline">Breakfast</button>
          <button className="hover:underline">Lunch</button>
          <button className="hover:underline">Dinner</button>
        </div>

        {/* Note */}

        <div className="flex p-4  space-x-8">
          {/* Food display */}
          <div className="w-2/3">
            <FoodDisplay />
          </div>

          {/* Cart */}
          <div className="w-1/3">
          <div className="bg-white border border-orange-500 p-4 rounded-md mb-4 text-sm shadow-sm shadow-orange-200">
          <strong>Note:</strong> You are responsible for paying the full amount of your order and collecting it.
        </div>

            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
