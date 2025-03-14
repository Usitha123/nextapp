import React, { useEffect } from 'react';

const PayHereButton = ({ 
  amount, 
  orderId, 
  itemDescription, 
  customerName, 
  customerEmail, 
  customerPhone, 
  currency = 'LKR', 
  onSuccess, 
  onFailed, 
  onDismissed 
}) => {
  useEffect(() => {
    // Load PayHere script if it's not already loaded
    if (!window.payhere) {
      const script = document.createElement('script');
      script.src = 'https://www.payhere.lk/lib/payhere.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = () => {
    // Make sure the script is loaded
    if (!window.payhere) {
      console.error('PayHere script not loaded yet');
      return;
    }

    // Payment configuration
    const payment = {
      sandbox: true, // Set to false when going live
      merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
      return_url: window.location.origin + '/payment/success',
      cancel_url: window.location.origin + '/payment/cancelled',
      notify_url: `${process.env.NEXT_PUBLIC_API_URL}/api/payment/notify`,
      order_id: orderId,
      items: itemDescription,
      amount: amount,
      currency: currency,
      first_name: customerName,
      email: customerEmail,
      phone: customerPhone,
      custom_1: '', // You can add custom parameters if needed
      custom_2: '',
    };

    // PayHere event handlers
    window.payhere.onCompleted = function onCompleted(orderId) {
      console.log("Payment completed. OrderID: " + orderId);
      if (onSuccess) onSuccess(orderId);
    };

    window.payhere.onDismissed = function onDismissed() {
      console.log("Payment dismissed");
      if (onDismissed) onDismissed();
    };

    window.payhere.onError = function onError(error) {
      console.log("Payment error: " + error);
      if (onFailed) onFailed(error);
    };

    // Start payment
    window.payhere.startPayment(payment);
  };

  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      Pay Now
    </button>
  );
};

export default PayHereButton;