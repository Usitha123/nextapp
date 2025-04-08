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
    <div className="w-full p-2 mx-auto bg-gray-200 rounded-lg shadow-lg overflow-auto">
      <h2 className="m-4 text-xl font-bold">Canteens Report</h2>
      <table className="min-w-full bg-gray-100 border rounded-lg table-auto overflow-hidden">
        <thead>
          <tr className="text-left bg-orange-500 rounded-t-lg">
            <th className="px-4 py-2 border-b first:rounded-tl-lg last:rounded-tr-lg">Item</th>
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
      <div className="m-3 text-right">
        <span className="text-lg font-bold">Total Amount: ${calculateTotalAmount()}</span>
      </div>
    </div>
  );  
};

export default InvoiceTable;
