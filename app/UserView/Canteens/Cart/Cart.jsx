import { Trash2 } from 'lucide-react';
import React from 'react';

const Cart = () => {
  // Sample cart items (replace with state/context in actual implementation)
  const cartItems = [
    { id: 1, name: 'Meal-1', quantity: 1, price: 1500 },
    { id: 2, name: 'Meal-1', quantity: 2, price: 1500 },
    { id: 3, name: 'Meal-1', quantity: 5, price: 1500 },
  ];

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Your Cart</h3>
      <div>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <div className='p-1'>
              <span>{item.name}</span>
              <span className="mx-2">× {item.quantity}</span>
              <span className="text-orange-500">Rs: {item.price}.00</span>
            </div>
            <button className="text-red-500 hover:text-red-700"> <Trash2/> </button>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t pt-2">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal:</span>
          <span>Rs: {subtotal}.00</span>
        </div>
        <div className="flex mt-4 space-x-4">
          <button className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancel</button>
          <button className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600">Place Order</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;