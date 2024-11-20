import React from 'react';
import Image from 'next/image';

function CanteenCard({ name, image }) {
  return (
    <div className="flex flex-col my-auto text-xl font-medium leading-none text-center text-white">
      <div className="flex flex-col pt-3.5 h-[220px] rounded-t-3xl bg-white">
        <Image
          src={image}
          alt={`${name} canteen`}
          className="object-contain mx-auto"
          width={200} // Adjust as per your requirement
          height={200} // Adjust as per your requirement
          loading="lazy"
        />
      </div>
      <div className="rounded-b-xl py-2 bg-orange-500 min-h-[40px]">
        {name}
      </div>
    </div>
  );
}

export default CanteenCard;
