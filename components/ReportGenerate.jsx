"use client"; // Add this line to mark the component as a client component

import html2pdf from 'html2pdf.js';
import { useRef } from "react";
import Invoice from "./Invoice";

// Change the function name to start with an uppercase letter
export default function Dashboard() {
  const contentRef = useRef();

  const exportPDF = () => {
    const options = {
      filename: 'canteen-dashboard.pdf',
      margin: [10, 10, 10, 10],
      x: 10,
      y: 10,
      html2canvas: { scale: 2 },  // Optional: Enhance quality of rendering
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
