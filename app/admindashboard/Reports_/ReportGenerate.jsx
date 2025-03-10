"use client"; // Ensure this component runs on the client side

import { useRef, useEffect } from "react";
import Reportdetails from './Reportdetails'
import { File, FileOutput } from "lucide-react";

export default function Dashboard() {
  const contentRef = useRef();

  useEffect(() => {
    // Dynamically load html2pdf.js from CDN
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.js";
    script.onload = () => {
      window.html2pdf = window.html2pdf || html2pdf;  // Ensure html2pdf is available globally
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  const exportPDF = () => {
    const options = {
      filename: "canteen-dashboard.pdf",
      margin: [10, 10, 10, 10],
      x: 10,
      y: 10,
      html2canvas: { scale: 2 }, // Optional: Enhance quality of rendering
    };

    // Ensure html2pdf() is available before calling it
    if (window.html2pdf) {
      window.html2pdf().from(contentRef.current).set(options).save();
    } else {
      console.error("html2pdf.js not loaded.");
    }
  };

  return (
    <div className="flex">
      <h1>Hello</h1>
      <div className="flex-1">
        <h1>Hello usitha</h1>

        <div className="p-4 " ref={contentRef}>
          <Reportdetails />
        </div>

        <button
          onClick={exportPDF}
          className=" items-center flex gap-2 m-4 mx-auto px-3 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black"
        >
          Export PDF <FileOutput className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
}
