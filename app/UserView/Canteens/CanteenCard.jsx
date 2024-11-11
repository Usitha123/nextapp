import React from 'react';

function CanteenCard({ name, image }) {
  return (
      <div className="flex flex-col  text-3xl font-medium leading-none  text-center text-white ">
        <div className="flex flex-col  pt-3.5 h-[220px] rounded-t-3xl   bg-white">
          <img
            loading="lazy"
            src={image}
            alt={`${name} canteen`}
            className="mx-auto object-contain h-[90%] w-[90%]"
          />
          
        </div>
        <div className="rounded-b-3xl bg-orange-500 min-h-[40px] ">
            {name}
          </div>
      </div>
  );
}

export default CanteenCard;