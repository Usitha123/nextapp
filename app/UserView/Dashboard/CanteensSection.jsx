"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function CanteensSection() {
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
        
        // Limit to only 4 canteens for the dashboard
        setCanteens(activeCanteens.slice(0, 4));
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
            <Link
              href={`/UserView/Canteens/${encodeURIComponent(
                canteen.canteenName || ""
              )}`}
            >
            <img
              src={canteen.image || "/fallback.jpg"}
              alt={canteen.name || "Canteen"}
              className="object-cover w-full h-36"
            />
            
              <div className="py-2 font-semibold text-white bg-orange-500 cursor-pointer">
                {canteen.canteenName}
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      
    </section>
  );
}