"use client"
import { useEffect, useState } from 'react';

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
    return <p>Loading...</p>;
  }

  return (
    <div>
      {orderSuccess ? (
        <p>Your order was placed successfully!</p>
      ) : (
        <p>There was an issue placing your order. Please try again.</p>
      )}
      {/* Optionally display order details */}
      <div>
        <h3>Order Details</h3>
        <p>Canteen: {orderData.canteenName}</p>
        <p>Order Type: {orderData.orderType}</p>
        <ul>
          {orderData.meals.map((meal, index) => (
            <li key={index}>{meal.mealName} x {meal.mealQuantity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentComplete;
