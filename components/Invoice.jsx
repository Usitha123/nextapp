import React from "react";

const InvoiceTable = () => {
  const data = [
    {
      item: "Product 1",
      description: "Description for product 1",
      quantity: 2,
      unitPrice: 50,
      total: 100,
    },
    {
      item: "Product 2",
      description: "Description for product 2",
      quantity: 1,
      unitPrice: 75,
      total: 75,
    },
    {
      item: "Product 3",
      description: "Description for product 3",
      quantity: 3,
      unitPrice: 30,
      total: 90,
    },
  ];

  const calculateTotalAmount = () => {
    return data.reduce((acc, item) => acc + item.total, 0);
  };

  return (
    <div className="max-w-4xl p-6 mx-auto my-8 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Invoice</h2>
      <table className="min-w-full border-collapse table-auto">
        <thead>
          <tr className="text-left bg-gray-200">
            <th className="px-4 py-2 border-b">Item</th>
            <th className="px-4 py-2 border-b">Description</th>
            <th className="px-4 py-2 border-b">Quantity</th>
            <th className="px-4 py-2 border-b">Unit Price</th>
            <th className="px-4 py-2 border-b">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{item.item}</td>
              <td className="px-4 py-2 border-b">{item.description}</td>
              <td className="px-4 py-2 border-b">{item.quantity}</td>
              <td className="px-4 py-2 border-b">${item.unitPrice}</td>
              <td className="px-4 py-2 border-b">${item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-right">
        <span className="text-xl font-bold">Total Amount: ${calculateTotalAmount()}</span>
      </div>
    </div>
  );
};

export default InvoiceTable;
