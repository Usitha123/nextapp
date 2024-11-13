import React, { useContext } from 'react';
import { StoreContext } from '@/app/context/StoreContext';
import Image from 'next/image';
import friedrice from '../../../assets/friedrice.jpg'
import rice from '../../../assets/rice.jpg'
import kottu from '../../../assets/kottu.jpg'
import milkrice from '../../../assets/milkrice.jpg'

const FoodDisplay = () => {
  const context = useContext(StoreContext);
  // const food_list = context ? context.food_list : [];

  const food_list = [
    {
        _id: "1",
        name: "Fried Rice",
        image: friedrice,
        price: 250
    },
    {
        _id: "2",
        name: "Rice",
        image: rice,
        price: 200
    },
    {
        _id: "3",
        name: "Kottu",
        image: kottu,
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
    <div className="grid md:grid-cols-2 gap-4">
      
      {food_list.map((food) => (
        // <div key={food._id} className="border rounded-lg p-4 shadow-sm">
        <div key={food._id} className="border bg-white rounded-3xl w-full m-auto">

          <Image
             src={food.image}
             alt={food.name}
             width={800}  // Set a higher width for better quality
             height={800} // Set a higher height to maintain aspect ratio
             className="w-full object-cover rounded-3xl"
             quality={100} // Optional: Ensures maximum image quality
             layout="responsive" 
          />
          <div className="p-4 grid grid-cols-[auto_40px]">
            <div className="flex-col"><h3 className="mt-2 text-lg font-semibold">{food.name}</h3>
          <p className="text-gray-500">Rs {food.price}.00</p>
          </div>
          <div className='items-'><button className="mt-2 bg-orange-500 text-white py-1 px-4 rounded hover:bg-orange-600">
            +
          </button></div>
          
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default FoodDisplay;
