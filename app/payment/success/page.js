'use client';

import React from 'react';

export default function PaymentSuccess() {
    return (
      <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-green-600">Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        {/* You could display order details here */}
      </div>
    );
  }


