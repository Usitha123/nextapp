import React, { useEffect, useState } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";
import Deletestudents from "./Deletestudents";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Constants
const ITEMS_PER_PAGE = 4;

const StudentTable = () => {
  // State Management
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Derived State
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/allstudentslist");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Pagination Handlers
  const handleNext = () => setCurrentPage((prev) => prev + 1);
  const handlePrev = () => setCurrentPage((prev) => prev - 1);

  // Modal Handlers
  const openEditModal = (studentId) => {
    setSelectedStudentId(studentId);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  // Delete Student
  const handleDelete = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/deleteuser?id=${selectedStudent._id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete student");
      setStudents((prev) => prev.filter((student) => student._id !== selectedStudent._id));
      closeModals();
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Status
  const updateStatus = async (studentId, newStatus) => {
    try {
      const response = await fetch(`/api/updatestatususer?id=${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update status");
      } else {
        alert(`Status updated to ${newStatus}`);
        setStudents((prev) =>
          prev.map((student) =>
            student._id === studentId ? { ...student, status: newStatus } : student
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  // Format Date
  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  return (
    <div className="p-4 rounded-lg">
      <div className="overflow-auto justify-center max-w-[75vw] lg:max-w-full rounded-xl">
        <table className="w-full text-sm text-left text-gray-400 bg-[#2B2623] rounded-xl">
          <thead>
            <tr className="text-black bg-orange-500">
              {["First Name", "Last Name", "Email", "Faculty", "Phone Number", "Status", "Date Registered", "Actions"].map((header) => (
                <th key={header} className="p-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student._id} className="border-b-2 border-[#3B3737]">
                <td className="p-2">{student.firstName}</td>
                <td className="p-2">{student.lastName}</td>
                <td className="p-2">{student.email}</td>
                <td className="p-2">{student.faculty}</td>
                <td className="p-2">{student.phoneNumber}</td>
                <td className="p-2">{student.status}</td>
                <td className="p-2">{formatDate(student.createdAt)}</td>
                <td className="flex p-2 space-x-2">
                  <button
                    onClick={() => openDeleteModal(student)}
                    className=" hover:text-red-700"
                    aria-label="Delete Student"
                  >
                    <FaRegTrashAlt />
                  </button>
                  <button
                    onClick={() => openEditModal(student._id)}
                    className=" hover:text-blue-700"
                    aria-label="Edit Student"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <div className="flex items-center gap-2 justify-end mt-4">
  <button
    onClick={handlePrev}
    className="flex items-center gap-0 px-2 py-1 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
    disabled={currentPage === 1}
  >
    <ChevronLeft />
    Prev
  </button>
  <span className="text-gray-400">Page {currentPage}</span>
  <button
    onClick={handleNext}
    className="flex items-center gap-0 px-2 py-1 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
    disabled={currentPage === Math.ceil(students.length / ITEMS_PER_PAGE)}
  >
    Next
    <ChevronRight />
  </button>
</div>

  
      {/* Edit Status Modal */}
      <UpdateStatusModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSave={(newStatus) => {
          updateStatus(selectedStudentId, newStatus);
          closeModals();
        }}
      />
  
      {/* Delete Confirmation Modal */}
      <Deletestudents
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onDelete={handleDelete}
      />
    </div>
  );
  
};

export default StudentTable;
