'use client';

import { useState } from 'react';
import PayHereButton from '@/components/PayHereButton';

export default function Checkout() {
  const [orderDetails, setOrderDetails] = useState({
    amount: 1000,
    orderId: 'ORDER_' + Date.now(),
    itemDescription: 'Sample Product',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '1234567890',
  });

  const handlePaymentSuccess = (orderId) => {
    alert(`Payment successful! Order ID: ${orderId}`);
    // Redirect to success page or update UI
  };

  const handlePaymentFailed = (error) => {
    alert(`Payment failed: ${error}`);
    // Update UI to show error
  };

  const handlePaymentDismissed = () => {
    alert('Payment was cancelled');
    // Update UI accordingly
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      
      <div className="mb-6">
        <h2 className="font-bold">Order Summary</h2>
        <p>Product: {orderDetails.itemDescription}</p>
        <p>Amount: {orderDetails.amount} LKR</p>
      </div>
      
      <PayHereButton
        amount={orderDetails.amount}
        orderId={orderDetails.orderId}
        itemDescription={orderDetails.itemDescription}
        customerName={orderDetails.customerName}
        customerEmail={orderDetails.customerEmail}
        customerPhone={orderDetails.customerPhone}
        onSuccess={handlePaymentSuccess}
        onFailed={handlePaymentFailed}
        onDismissed={handlePaymentDismissed}
      />
    </div>
  );
}
