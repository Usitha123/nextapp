"use client";

import React, { useEffect, useState } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import Cashierstatus from "./Cashierstatus";
import Deletecashier from "./Deletecashier";

const ITEMS_PER_PAGE = 4;

const StudentTable = () => {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteCashierModalOpen, setIsDeleteCashierModalOpen] = useState(false);

  useEffect(() => {
    const fetchCashiers = async () => {
      try {
        const res = await fetch("/api/allcashierlist");
        if (!res.ok) {
          throw new Error("Failed to fetch cashiers");
        }
        const data = await res.json();
        setCashiers(data);
      } catch (error) {
        console.error("Error fetching cashiers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCashiers();
  }, []);

  const handleNext = () => {
    if (currentPage < Math.ceil(cashiers.length / ITEMS_PER_PAGE)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCashiers = cashiers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-4 text-white bg-gray-800 rounded-lg">
      <h2 className="mb-4 text-xl font-semibold">Cashier List</h2>
      <table className="w-full text-left text-gray-300">
        <thead>
          <tr className="text-white bg-orange-500">
            <th className="p-2">First Name</th>
            <th className="p-2">Last Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone Number</th>
            <th className="p-2">Nic Number</th>
            <th className="p-2">Status</th>
            <th className="p-2">Canteen</th>
            <th className="p-2">Date Registered</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCashiers.map((cashier) => (
            <tr key={cashier._id} className="border-b border-gray-700">
              <td className="p-2">{cashier.firstName}</td>
              <td className="p-2">{cashier.lastName}</td>
              <td className="p-2">{cashier.email}</td>
              <td className="p-2">{cashier.phoneNumber}</td>
              <td className="p-2">{cashier.nicNumber}</td>
              <td className="p-2">{cashier.status}</td>
              <td className="p-2">{cashier.selectCanteen}</td>
              <td className="p-2">{formatDate(cashier.createdAt)}</td>
              <td className="flex p-2 space-x-2">
                <button
                  onClick={() => setIsDeleteCashierModalOpen(true)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaRegTrashAlt />
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={handleNext}
          className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
          disabled={currentPage === Math.ceil(cashiers.length / ITEMS_PER_PAGE)}
        >
          Next
        </button>
      </div>
      <Cashierstatus isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Deletecashier
        isOpen={isDeleteCashierModalOpen}
        onClose={() => setIsDeleteCashierModalOpen(false)}
      />
    </div>
  );
};

export default StudentTable;