import Image from 'next/image';
import React from 'react';

function CanteenCard({ name, image }) {
  return (
      <div className="flex flex-col my-auto text-xl  font-medium leading-none  text-center text-white ">
        <div className=" flex flex-col  pt-3.5 h-[220px] rounded-t-3xl   bg-white">
          <Image
            loading="lazy"
            src={image}
            alt={`${name} canteen`}
            className="mx-auto object-contain"
            width= {260}  // Adjust the width as needed
            height={250}  // Adjust the height as needed
          />
          
        </div>
        <div className="rounded-b-xl py-2 bg-orange-500 min-h-[40px] ">
            {name}
          </div>
      </div>
  );
}

export default CanteenCard;