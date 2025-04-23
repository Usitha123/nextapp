"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const PaymentComplete = () => {
  const [orderData, setOrderData] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    const storedOrderData = JSON.parse(localStorage.getItem('orderData'));

    if (storedOrderData) {
      setOrderData(storedOrderData);
    }

    const completePayment = async () => {
      if (sessionId) {
        try {
          // Verify payment status with Stripe
          const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);

          if (res.ok) {
            // If payment is successful, send orderData to the server
            const orderRes = await fetch('/api/addorders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(storedOrderData), // Send orderData here
            });

            if (orderRes.ok) {
              setOrderSuccess(true);
              localStorage.removeItem('orderData'); // Clear the stored order data
            } else {
              alert("Failed to place order.");
            }
          } else {
            alert("Payment verification failed.");
          }
        } catch (error) {
          alert("An error occurred during payment verification.");
        }
      }
    };

    completePayment();
  }, []);

  if (!orderData) {
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Status Message */}
            <div className="flex flex-col items-center justify-center mb-8">
              {orderSuccess ? (
                <div className="flex flex-col items-center">
                  <FaCheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800">Order Placed Successfully!</h2>
                  <p className="mt-2 text-gray-600">Your order has been confirmed and is being processed.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FaTimesCircle className="w-16 h-16 text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800">Order Failed</h2>
                  <p className="mt-2 text-gray-600">There was an issue placing your order. Please try again.</p>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="p-6 mb-6 bg-gray-50 rounded-lg">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Order Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-white rounded-md">
                  <span className="font-medium text-gray-600">Canteen:</span>
                  <span className="text-gray-800">{orderData.canteenName}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-md">
                  <span className="font-medium text-gray-600">Order Type:</span>
                  <span className="text-gray-800">{orderData.orderType}</span>
                </div>
                <div className="p-3 bg-white rounded-md">
                  <h4 className="mb-2 font-medium text-gray-600">Items Ordered:</h4>
                  <ul className="space-y-2">
                    {orderData.meals.map((meal, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="text-gray-800">{meal.mealName}</span>
                        <span className="text-gray-600">x {meal.mealQuantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center">
              <Link 
                href="/UserView/Canteens" 
                className="flex items-center px-6 py-3 text-white transition-colors duration-200 bg-orange-500 rounded-md hover:bg-orange-600"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComplete;
