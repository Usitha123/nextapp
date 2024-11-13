import React, { useContext } from 'react';
// import { StoreContext } from '@/app/context/StoreContext';
import Image from 'next/image';
import milkrice from '@/src/loginbackground.jpeg'


const FoodDisplay = () => {
  //const context = useContext(StoreContext);
  // const food_list = context ? context.food_list : [];

  const food_list = [
    {
        _id: "1",
        name: "Fried Rice",
        image: milkrice,
        price: 250
    },
    {
        _id: "2",
        name: "Rice",
        image: milkrice,
        price: 200
    },
    {
        _id: "3",
        name: "Kottu",
        image: milkrice,
        price: 300
    },
    {
        _id: "4",
        name: "Milk Rice",
        image: milkrice,
        price: 150
    },
]
  return (
    <div className="grid gap-4 md:grid-cols-2">
      
      {food_list.map((food) => (
        // <div key={food._id} className="p-4 border rounded-lg shadow-sm">
        <div key={food._id} className="w-full m-auto bg-white border rounded-3xl">

          <Image
             src={food.image}
             alt={food.name}
             width={800}  // Set a higher width for better quality
             height={800} // Set a higher height to maintain aspect ratio
             className="object-cover w-full rounded-3xl"
             quality={100} // Optional: Ensures maximum image quality
             layout="responsive" 
          />
          <div className="p-4 grid grid-cols-[auto_40px]">
            <div className="flex-col"><h3 className="mt-2 text-lg font-semibold">{food.name}</h3>
          <p className="text-gray-500">Rs {food.price}.00</p>
          </div>
          <div className='items-'><button className="px-4 py-1 mt-2 text-white bg-orange-500 rounded hover:bg-orange-600">
            +
          </button></div>
          
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default FoodDisplay;
