"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Dummy popular items list
const popularItems = [
  {
    name: "Chicken Fried Rice",
    canteen: "Open-Canteen",
    image: "https://example.com/chicken-fried-rice.jpg",
  },
  {
    name: "Chicken Kottu",
    canteen: "GYM-Canteen",
    image: "https://example.com/chicken-kottu.jpg",
  },
  {
    name: "Vegetable Pasta",
    canteen: "Rahula-Canteen",
    image: "https://example.com/vegetable-pasta.jpg",
  },
];

export default function DashboardContent() {
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const res = await fetch("/api/allcanteenslist", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        const activeCanteens = data.filter(
          (canteen) =>
            canteen.ownerstatus !== "Inactive" && canteen.status === "Active"
        );
        setCanteens(activeCanteens);
      } catch (err) {
        console.error("Error fetching canteens:", err);
        setError("Failed to load canteens.");
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-xl">
      {/* Popular Items */}
      <section>
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
              <img
                src={item.image}
                alt={item.name}
                className="object-cover w-full h-40"
              />
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
      </section>

      {/* Canteens */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Canteens</h3>
          <Link
            href="/UserView/Canteens"
            className="text-sm font-medium text-orange-500"
          >
            View All
          </Link>
        </div>

        {loading && <p>Loading canteens...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {canteens.map((canteen, index) => (
            <div
              key={index}
              className="overflow-hidden text-center bg-white shadow-md rounded-xl"
            >
              <img
                src={canteen.image || "/fallback.jpg"}
                alt={canteen.name || "Canteen"}
                className="object-cover w-full h-28"
              />
              <Link
                href={`/UserView/Canteens/${encodeURIComponent(
                  canteen.canteenName || ""
                )}`}
              >
                <div className="py-2 font-semibold text-white bg-orange-500 cursor-pointer">
                  {canteen.canteenName}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
