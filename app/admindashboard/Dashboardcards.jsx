import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

// Reusable DashboardCard component
const DashboardCard = ({ count, label }) => (
  <div className="flex flex-col items-center justify-center p-4 text-orange-500 bg-gray-900 rounded-lg w-36">
    <div className="flex items-center gap-2 text-3xl font-bold">
      <span>{count}</span>
      <FaUser size={20} className="text-orange-500" />
    </div>
    <div className="mt-2 text-sm text-gray-300">{label}</div>
  </div>
);

const DashboardCards = () => {
  const [canteens, setCanteens] = useState([]);
  const [blockedCanteens, setBlockedCanteens] = useState([]);
  const [students, setStudents] = useState([]); // New state for students
  const [blockedStudents, setBlockedStudents] = useState([]); // New state for blocked students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCanteenCount, setActiveCanteenCount] = useState(0);
  const [blockedCanteenCount, setBlockedCanteenCount] = useState(0);
  const [activeStudentCount, setActiveStudentCount] = useState(0); // New state for active students
  const [blockedStudentCount, setBlockedStudentCount] = useState(0); // New state for blocked students

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch canteens data
        const canteensRes = await fetch('/api/allcanteenslist', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!canteensRes.ok) throw new Error('Failed to fetch canteens');
        const canteensData = await canteensRes.json();

        // Separate active and blocked canteens
        const activeCanteens = canteensData.filter(
          (canteen) => canteen.ownerstatus !== 'Inactive' && canteen.status === 'Active'
        );
        const blockedCanteens = canteensData.filter(
          (canteen) => canteen.ownerstatus === 'Inactive' || canteen.status !== 'Active'
        );

        setCanteens(activeCanteens);
        setBlockedCanteens(blockedCanteens);
        setActiveCanteenCount(activeCanteens.length);
        setBlockedCanteenCount(blockedCanteens.length);

        // Fetch students data
        const studentsRes = await fetch('/api/allstudentslist', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!studentsRes.ok) throw new Error('Failed to fetch students');
        const studentsData = await studentsRes.json();

        // Separate active and blocked students
        const activeStudents = studentsData.filter((student) => student.status === 'active');
        const blockedStudents = studentsData.filter((student) => student.status !== 'active');

        setStudents(activeStudents);
        setBlockedStudents(blockedStudents);
        setActiveStudentCount(activeStudents.length);
        setBlockedStudentCount(blockedStudents.length);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex gap-4 p-4 mt-4 bg-gray-800 rounded-lg">
      <DashboardCard count={activeCanteenCount} label="Active Canteens" />
      <DashboardCard count={blockedCanteenCount} label="Blocked Canteens" />
      <DashboardCard count={activeStudentCount} label="Active Students" /> {/* Display active students count */}
      <DashboardCard count={blockedStudentCount} label="Blocked Students" /> {/* Display blocked students count */}
    </div>
  );
};

export default DashboardCards;
