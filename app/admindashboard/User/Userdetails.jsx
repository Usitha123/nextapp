import React, { useState } from 'react';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";

// Sample data for demonstration
const students = [
  { id: 1, name: "Sarath", phone: "0112596347", email: "email123@gmail.com", faculty: "Computing", status: "Active", date: "20/03/2021" },
  { id: 2, name: "Amal", phone: "0112596347", email: "email123@gmail.com", faculty: "Medical", status: "Active", date: "20/03/2021" },
  { id: 3, name: "Kamal", phone: "0112596347", email: "email123@gmail.com", faculty: "Engineering", status: "Active", date: "20/03/2021" },
  { id: 4, name: "Amal", phone: "0112596347", email: "email123@gmail.com", faculty: "Management", status: "Block", date: "20/03/2021" },
];

// Define pagination constants
const ITEMS_PER_PAGE = 4;

const StudentTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < Math.ceil(students.length / ITEMS_PER_PAGE)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-4 text-white bg-gray-800 rounded-lg">
      <h2 className="mb-4 text-xl font-semibold">Student</h2>
      <table className="w-full text-left text-gray-300">
        <thead>
          <tr className="text-white bg-orange-500">
            <th className="p-2">Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Email</th>
            <th className="p-2">Faculty</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date Registered</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student.id} className="border-b border-gray-700">
              <td className="p-2">{student.name}</td>
              <td className="p-2">{student.phone}</td>
              <td className="p-2">{student.email}</td>
              <td className="p-2">{student.faculty}</td>
              <td className="p-2">{student.status}</td>
              <td className="p-2">{student.date}</td>
              <td className="p-2">
                <button className="text-red-500 hover:text-red-700">
                <FaRegTrashAlt/> {/* Font Awesome delete icon */}
                </button>
                <button 
                onClick={() => setIsModalOpen(true)}
                className="text-red-500 hover:text-red-700">
                <FaEdit/> {/* Font Awesome edit icon */}
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
          disabled={currentPage === Math.ceil(students.length / ITEMS_PER_PAGE)}
        >
          Next
        </button>
      </div>
       {/* Modal Component */}
       <UpdateStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StudentTable;
