"use client";

import React from "react";
import PopularRecentSection from "./PopularRecentSection";
import CanteensSection from "./CanteensSection";

export default function DashboardContent() {
  return (
    <div className="p-2 bg-gray-100 rounded-xl">
      <PopularRecentSection />
      <div className="mt-8">
        <CanteensSection />
      </div>
    </div>
  );
}
