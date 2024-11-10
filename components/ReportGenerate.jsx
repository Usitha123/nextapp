"use client"; // Add this line to mark the component as a client component

import { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js"; // Import normally
import Invoice from "./Invoice";

export default function Dashboard() {
  const contentRef = useRef();
  const [isClient, setIsClient] = useState(false); // State to check if we're on the client side

  useEffect(() => {
    setIsClient(true); // Update state when the component mounts (client-side only)
  }, []);

  const exportPDF = () => {
    if (!isClient) return; // Ensure code only runs on the client-side

    const options = {
      filename: "canteen-dashboard.pdf",
      margin: [10, 10, 10, 10],
      x: 10,
      y: 10,
      html2canvas: { scale: 2 }, // Optional: Enhance quality of rendering
    };
    html2pdf().from(contentRef.current).set(options).save();
  };

  return (
    <div className="flex">
      <h1>Hello</h1>
      <div className="flex-1">
        <h1>Hello usitha</h1>

        <div className="p-4" ref={contentRef}>
          <Invoice />
        </div>

        <button
          onClick={exportPDF}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}
