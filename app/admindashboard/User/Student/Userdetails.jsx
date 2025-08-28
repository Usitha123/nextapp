import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";
import Deletestudents from "./Deletestudents";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render for status badges

  // Fetch Students
  const fetchStudents = useCallback(async () => {
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
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const totalPages = useMemo(() => Math.ceil(students.length / ITEMS_PER_PAGE), [students.length]);

  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return students.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [students, currentPage, updateTrigger]);

  // Pagination handlers
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Modal handlers
  const openEditModal = (studentId) => { setSelectedStudentId(studentId); setIsEditModalOpen(true); };
  const openDeleteModal = (student) => { setSelectedStudent(student); setIsDeleteModalOpen(true); };
  const closeModals = () => { setIsEditModalOpen(false); setIsDeleteModalOpen(false); setSelectedStudent(null); };

  // Delete Student
  const handleDelete = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/deleteuser?id=${selectedStudent._id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete student");
      setStudents(prev => prev.filter(student => student._id !== selectedStudent._id));
      closeModals();
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally { setLoading(false); }
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
        setStudents(prev =>
          prev.map(student =>
            student._id === studentId ? { ...student, status: newStatus } : student
          )
        );
        setUpdateTrigger(prev => prev + 1);
        alert(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (loading && students.length === 0) {
    return <div className="flex items-center justify-center p-8 text-gray-400">Loading students...</div>;
  }

  return (
    <div className="p-2 rounded-lg">
      <div className="overflow-auto max-w-[75vw] lg:max-w-full rounded-xl">
        <table className="w-full text-sm text-left text-gray-400 bg-[#2B2623] rounded-xl">
          <thead>
            <tr className="text-black bg-orange-500">
              {["First Name", "Last Name", "Email", "Faculty", "Phone Number", "Status", "Date Registered", "Actions"].map(header => (
                <th key={header} className="p-3 font-medium">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentStudents.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  {students.length === 0 ? "No students found" : "No students on this page"}
                </td>
              </tr>
            ) : (
              currentStudents.map(student => (
                <tr key={student._id} className="border-b border-[#3B3737] hover:bg-[#3B3737]/50 transition">
                  <td className="p-3">{student.firstName}</td>
                  <td className="p-3">{student.lastName}</td>
                  <td className="p-3 break-all">{student.email}</td>
                  <td className="p-3">{student.faculty}</td>
                  <td className="p-3">{student.phoneNumber}</td>
                  <td className="p-3">
                    <span
                      key={`${student._id}-${student.status}-${updateTrigger}`}
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[70px] transition-colors ${
                        student.status?.toLowerCase() === 'active' 
                          ? 'bg-green-900/50 text-green-400 border border-green-700/50' 
                          : student.status?.toLowerCase() === 'pending'
                          ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50'
                          : 'bg-red-900/50 text-red-400 border border-red-700/50'
                      }`}
                    >
                      {student.status || 'inactive'}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(student.createdAt)}</td>
                  <td className="flex items-center space-x-2 p-3">
                    <button onClick={() => openDeleteModal(student)} className="p-1 text-red-400 hover:text-red-300">
                      <FaRegTrashAlt size={14} />
                    </button>
                    <button onClick={() => openEditModal(student._id)} className="p-1 text-blue-400 hover:text-blue-300">
                      <FaEdit size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500/50 rounded-lg hover:bg-black hover:border-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="px-3 py-2 text-sm text-gray-400">Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500/50 rounded-lg hover:bg-black hover:border-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modals */}
      <UpdateStatusModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSave={(newStatus) => { updateStatus(selectedStudentId, newStatus); closeModals(); }}
      />
      <Deletestudents
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default StudentTable;
