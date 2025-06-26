"use client"; // Ensure this component runs on the client side

import { useRef, useEffect, useState } from "react";
import Reportdetails from './Reportdetails'
import { useSession } from "next-auth/react";
import { FaCalendarAlt } from 'react-icons/fa';
import { FileOutput } from "lucide-react";

export default function Dashboard() {
  const contentRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();
  const { data: session } = useSession();
  const [hasOrders, setHasOrders] = useState(true);
  const [maxDate] = useState(new Date().toISOString().split('T')[0]); // Today's date
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], // Yesterday
    endDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0] // Yesterday
  });

  useEffect(() => {
    checkOrders();
  }, [dateRange]);

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

  const checkOrders = async () => {
    try {
      const res = await fetch('/api/vieworders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const { orders } = await res.json();

      // Filter orders by date range and current canteen
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.meals[0]?.timestamp);
        const startDate = new Date(dateRange.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        
        return orderDate >= startDate && 
               orderDate <= endDate && 
               order.canteenName === session?.user?.canteenName;
      });

      setHasOrders(filteredOrders.length > 0);
    } catch (error) {
      console.error('Error checking orders:', error);
    }
  };

  const exportPDF = () => {
    const options = {
      filename: `${session?.user?.canteenName}-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`,
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

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    
    // Ensure no future dates are selected
    if (value > maxDate) {
      return;
    }
    
    // Ensure start date is not after end date
    if (name === 'startDate' && value > dateRange.endDate) {
      return;
    }
    
    // Ensure end date is not before start date
    if (name === 'endDate' && value < dateRange.startDate) {
      return;
    }

    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIconClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  return (
    <div className="flex flex-col p-4 ">
      <div className="mb-6 space-y-4">
        <h2 className="text-xl text-white font-semibold">Generate Sales Report</h2>
        <div className="flex items-center  gap-6">
          <div className="relative text-white flex items-center gap-2">
            <label htmlFor="startDate" className="whitespace-nowrap">Start Date:</label>
            <div className="relative">
              <input
                ref={startDateRef}
                type="date"
                id="startDate"
                name="startDate"
                max={maxDate}
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="px-4 py-2 text-sm text-black border rounded hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button 
                type="button"
                onClick={() => handleIconClick(startDateRef)}
                className="absolute text-gray-500 transform -translate-y-1/2 right-2 top-1/2 hover:text-orange-500 focus:outline-none"
              >
                <FaCalendarAlt className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative text-white flex items-center  gap-2">
            <label htmlFor="endDate" className="whitespace-nowrap">End Date:</label>
            <div className="relative">
              <input
                ref={endDateRef}
                type="date"
                id="endDate"
                name="endDate"
                max={maxDate}
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="px-4 py-2 text-sm text-black  border rounded hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button 
                type="button"
                onClick={() => handleIconClick(endDateRef)}
                className="absolute text-gray-500 transform -translate-y-1/2 right-2 top-1/2 hover:text-orange-500 focus:outline-none"
              >
                <FaCalendarAlt className="w-5 h-5" />
              </button>
            </div>
          </div>
          {hasOrders && (
            <button
              onClick={exportPDF}
              className=" px-4 py-2 flex gap-2 text-sm font-medium bg-orange-500 text-black rounded-xl hover:bg-orange-600">               
              Export as PDF <FileOutput/>
            </button> 
          )}
        </div>
      </div>

      {hasOrders ? (
        <div className="p-4 bg-white rounded-lg shadow" ref={contentRef}>
          <Reportdetails dateRange={dateRange} />
        </div>
      ) : (
        <div className="p-8 text-lg text-center text-gray-600 bg-gray-100 rounded-lg">
          No orders placed in this duration
        </div>
      )}
    </div>
  );
}
