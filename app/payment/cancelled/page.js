'use client';

import React from 'react';

export default function PaymentCancelled() {
    return (
      <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-red-600">Payment Cancelled</h1>
        <p>Your payment has been cancelled. If you encountered any issues, please contact our customer support.</p>
      </div>
    );
  }
