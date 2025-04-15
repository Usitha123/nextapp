import React from "react";
import Link from 'next/link';

const popularItems = [
  {
    name: "Chicken Fried Rice",
    canteen: "Open-Canteen",
    image:
      "https://example.com/chicken-fried-rice.jpg", // replace with actual image URL
  },
  {
    name: "Chicken Kottu",
    canteen: "GYM-Canteen",
    image:
      "https://example.com/chicken-kottu.jpg", // replace with actual image URL
  },
  {
    name: "Vegetable Pasta",
    canteen: "Rahula-Canteen",
    image:
      "https://example.com/vegetable-pasta.jpg", // replace with actual image URL
  },
];

const canteens = [
  {
    name: "Open",
    image: "https://example.com/open-canteen.jpg", // replace with actual image URL
  },
  {
    name: "GYM",
    image: "https://example.com/gym-canteen.jpg", // replace with actual image URL
  },
  {
    name: "Rahula",
    image: "https://example.com/rahula-canteen.jpg", // replace with actual image URL
  },
  {
    name: "SkyCafe",
    image: "https://example.com/skycafe.jpg", // replace with actual image URL
  },
];

export default function DashboardContent() {
  return (
    <div className="p-6 bg-gray-100 rounded-xl">
     
      <div>
        <div className="flex mb-4 space-x-4 text-lg font-medium">
          <span className="text-orange-500 border-b-2 border-orange-500 cursor-pointer">
            Popular
          </span>
          <span className="text-gray-500 cursor-pointer">Recent</span>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          {popularItems.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden bg-white shadow-md rounded-xl"
            >
              <img src={item.image} alt={item.name} className="object-cover w-full h-40" />
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.canteen}</p>
                </div>
                <button className="p-2 text-lg text-white bg-orange-500 rounded-full">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Canteens</h3>
          <Link href="../../UserView/Canteens" className="text-sm font-medium text-orange-500">View All</Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {canteens.map((canteen, index) => (
            <div
              key={index}
              className="overflow-hidden text-center bg-white shadow-md rounded-xl"
            >
              <img
                src={canteen.image}
                alt={canteen.name}
                className="object-cover w-full h-28"
              />
              <div className="py-2 font-semibold text-white bg-orange-500">
                {canteen.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
