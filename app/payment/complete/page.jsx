"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const PaymentComplete = () => {
  const [orderData, setOrderData] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading", "success", "failed"
  const html2pdfRef = useRef(null);
  const [html2pdfLoaded, setHtml2pdfLoaded] = useState(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    const storedOrderData = JSON.parse(localStorage.getItem('orderData'));

    if (storedOrderData) {
      setOrderData(storedOrderData);
    }

    const completePayment = async () => {
      if (!sessionId) {
        setStatus("failed");
        return;
      }

      // Prevent double submission on refresh/strict mode
      const processedKey = `order_processed_${sessionId}`;
      if (hasRunRef.current || sessionStorage.getItem(processedKey)) {
        setStatus("success");
        return;
      }

      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);

        if (res.ok) {
          const orderRes = await fetch('/api/addorders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storedOrderData),
          });

          if (orderRes.ok) {
            setStatus("success");
            sessionStorage.setItem(processedKey, '1');
            localStorage.removeItem('orderData');
          } else {
            setStatus("failed");
          }
        } else {
          setStatus("failed");
        }
      } catch (error) {
        setStatus("failed");
      } finally {
        hasRunRef.current = true;
      }
    };

    completePayment();

    // Dynamically load html2pdf.js script
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js";
    script.onload = () => {
      setHtml2pdfLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handler to download PDF
  const handleDownloadReceipt = () => {
    if (!html2pdfLoaded) {
      alert("PDF library is still loading, please wait.");
      return;
    }
    if (html2pdfRef.current) {
      const element = html2pdfRef.current;
      // Use the global html2pdf function loaded by the script
      window.html2pdf().from(element).set({
        margin: 0.5,
        filename: `Order_${orderData.orderId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).save();
    }
  };

  if (!orderData || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex space-x-2">
          <span className="w-2.5 h-2.5 bg-[#f76002] rounded-full animate-up-down-1"></span>
          <span className="w-2.5 h-2.5 bg-[#e85b04c4] rounded-full animate-up-down-2"></span>
          <span className="w-2.5 h-2.5 bg-[#e85b0491] rounded-full animate-up-down-3"></span>
          <span className="w-2.5 h-2.5 bg-[#e85b0456] rounded-full animate-up-down-4"></span>
        </div>
      </div>
    );
  }

  const issuedAt = new Date();
  const issuedAtText = issuedAt.toLocaleString();
  const subtotal = Array.isArray(orderData?.meals)
    ? orderData.meals.reduce(
        (t, m) => t + Number(m.mealPrice || 0) * Number(m.mealQuantity || 0),
        0
      )
    : 0;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex items-center justify-center flex-1 p-8">
        <div className="w-full max-w-md">
          <div className="p-6 bg-white rounded-lg shadow-md">

            {/* Status Message */}
            <div className="flex flex-col items-center justify-center mb-8">
              {status === "success" ? (
                <div className="flex flex-col items-center">
                  <FaCheckCircle className="w-16 h-16 mb-4 text-green-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Order Placed Successfully!</h2>
                  <p className="mt-2 text-gray-600">Your order has been confirmed and is being processed.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FaTimesCircle className="w-16 h-16 mb-4 text-red-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Order Failed</h2>
                  <p className="mt-2 text-gray-600">There was an issue placing your order. Please try again.</p>
                </div>
              )}
            </div>

            {/* Order Details to PDF */}
            <div 
              ref={html2pdfRef} 
              className="p-6 mb-6 bg-white rounded-2xl ring-1 ring-gray-200"
              style={{ backgroundColor: 'white' }} // Ensure white bg in PDF
            >
              {/* Header */}
              <div className="pb-4 mb-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Payment Receipt</h3>
                    <p className="text-sm text-gray-500">Order ID: <span className="font-medium text-gray-700">{orderData.orderId}</span></p>
                  </div>
                  <div className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded-full">
                    {orderData.paymentStatus === 'by_Card' ? 'Paid by Card' : 'Payment'}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Issued: {issuedAtText}</p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 gap-3 mb-4 text-sm md:grid-cols-2">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium text-gray-800">{orderData.userName}</p>
                  <p className="text-gray-600">{orderData.userEmail}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">Order Details</p>
                  <p className="font-medium text-gray-800">{orderData.canteenName}</p>
                  <p className="text-gray-600">Type: {orderData.orderType}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
                <table className="w-full text-sm">
                  <thead className="text-white bg-orange-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Item</th>
                      <th className="px-3 py-2 text-right">Unit Price</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderData.meals.map((m, idx) => {
                      const unit = Number(m.mealPrice || 0);
                      const qty = Number(m.mealQuantity || 0);
                      const line = unit * qty;
                      return (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-gray-800">{m.mealName}</td>
                          <td className="px-3 py-2 text-right text-gray-700">Rs {unit.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{qty}</td>
                          <td className="px-3 py-2 font-medium text-right text-gray-900">Rs {line.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-3 py-2 text-right" colSpan={3}><span className="text-sm text-gray-600">Subtotal</span></td>
                      <td className="px-3 py-2 text-right"><span className="text-sm font-medium text-gray-800">Rs {subtotal.toFixed(2)}</span></td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-right border-t" colSpan={3}><span className="text-base font-semibold text-gray-900">Total</span></td>
                      <td className="px-3 py-2 text-right border-t"><span className="text-base font-semibold text-gray-900">Rs {subtotal.toFixed(2)}</span></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <p className="mt-4 text-xs text-center text-gray-500">Thank you for your order!</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center px-6 py-3 text-white transition-colors duration-200 bg-orange-500 rounded-md hover:bg-orange-600"
              >
                Download Receipt
              </button>
              <Link 
                href="/UserView/Orders/Ongoing" 
                className="flex items-center px-6 py-3 text-white transition-colors duration-200 bg-orange-500 rounded-md hover:bg-orange-600"
              >
                <FaArrowLeft className="mr-2" />
                View on Orders
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComplete;
