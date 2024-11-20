import React, { useEffect, useState } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";
import Deletestudents from './Deletestudents';

// Define pagination constants
const ITEMS_PER_PAGE = 4;

const StudentTable = () => {
  const [students, setStudents] = useState([]); // State for storing student data
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteStudentsModalOpen, setIsDeleteStudentsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading status
  const [selectedStudent, setSelectedStudent] = useState(null); // Track selected student for edit/delete

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    // Fetch student data from the API
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/allstudentslist'); // Ensure this matches the API path
        if (!res.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await res.json();
        setStudents(data); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false); // Set loading to false after the fetch operation
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

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

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setIsDeleteStudentsModalOpen(true);
  };

  // Handle student deletion with API request
  const deleteStudent = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/deleteuser?id=${selectedStudent._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStudents(students.filter(student => student._id !== selectedStudent._id));
        setIsDeleteStudentsModalOpen(false); // Close the modal after deletion
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the student');
    } finally {
      setLoading(false);
    }
  };

  // Format the createdAt date
  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    return createdAt.toLocaleString(); // This will format the date and time to a default locale string
  };

  return (
    <div className="p-4 text-white bg-gray-800 rounded-lg">
      <h2 className="mb-4 text-xl font-semibold">Student</h2>
      <table className="w-full text-left text-gray-300">
        <thead>
          <tr className="text-white bg-orange-500">
            <th className="p-2">First Name</th>
            <th className="p-2">Last Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Faculty</th>
            <th className="p-2">Phone Number</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date Registered</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student._id} className="border-b border-gray-700">
              <td className="p-2">{student.firstName}</td>
              <td className="p-2">{student.lastName}</td>
              <td className="p-2">{student.email}</td>
              <td className="p-2">{student.faculty}</td>
              <td className="p-2">{student.phoneNumber}</td>
              <td className="p-2">{student.status}</td>
              <td className="p-2">{formatDate(student.createdAt)}</td>
              <td className="flex p-2 space-x-2">
                <button 
                  onClick={() => handleDelete(student)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaRegTrashAlt /> {/* Font Awesome delete icon */}
                </button>
                <button 
                  onClick={() => handleEdit(student)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaEdit /> {/* Font Awesome edit icon */}
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
      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={isModalOpen}
        student={selectedStudent}
        onClose={() => setIsModalOpen(false)}
      />
      {/* Delete Students Modal */}
      <Deletestudents
        isOpen={isDeleteStudentsModalOpen}
        student={selectedStudent}
        onClose={() => setIsDeleteStudentsModalOpen(false)}
        onDelete={deleteStudent} // Pass the delete function to the modal
      />
    </div>
  );
};

export default StudentTable;
