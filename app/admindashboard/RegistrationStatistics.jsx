import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const RegistrationStatistics = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchStudents();

    // Set up interval for refreshing data every 30 seconds
    const intervalId = setInterval(() => {
      fetchStudents();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/allstudentslist");
      if (!res.ok) throw new Error("Failed to fetch students");
      const students = await res.json();
      processRegistrationData(students);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const processRegistrationData = (students) => {
    // Filter active students
    const activeStudents = students.filter(student => student.status !== "Inactive");
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Process daily data (last 7 days)
    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayRegistrations = activeStudents.filter(student => {
        const registrationDate = new Date(student.createdAt);
        return registrationDate.toDateString() === date.toDateString();
      });

      return {
        name: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()],
        Registrations: dayRegistrations.length
      };
    }).reverse();

    // Process weekly data (last 4 weeks)
    const weeklyData = Array.from({ length: 4 }, (_, i) => {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      weekEnd.setHours(23, 59, 59, 999); // Include the full end day
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0); // Start from beginning of the day

      const weekRegistrations = activeStudents.filter(student => {
        const registrationDate = new Date(student.createdAt);
        return registrationDate >= weekStart && registrationDate <= weekEnd;
      });

      return {
        name: `Week ${4 - i}`,
        Registrations: weekRegistrations.length
      };
    }).reverse();

    // Process monthly data (last 6 months)
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const monthRegistrations = activeStudents.filter(student => {
        const registrationDate = new Date(student.createdAt);
        return registrationDate >= monthStart && registrationDate <= monthEnd;
      });

      return {
        name: monthStart.toLocaleString('default', { month: 'short' }),
        Registrations: monthRegistrations.length
      };
    }).reverse();

    setData({
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData
    });
  };

  const getData = () => {
    if (!data[timeframe]) return [];
    return data[timeframe];
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#2B2623] rounded-lg">
        <div className="text-gray-300">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#2B2623] rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-orange-500">Student Registration Statistics</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-2 rounded ${
              timeframe === 'daily'
                ? 'bg-orange-500 text-white'
                : 'bg-[#4D423E] text-gray-300'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded ${
              timeframe === 'weekly'
                ? 'bg-orange-500 text-white'
                : 'bg-[#4D423E] text-gray-300'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded ${
              timeframe === 'monthly'
                ? 'bg-orange-500 text-white'
                : 'bg-[#4D423E] text-gray-300'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <LineChart
            data={getData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4D423E" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2B2623',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Registrations" 
              stroke="#F97316" 
              strokeWidth={2}
              dot={{ fill: '#F97316', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RegistrationStatistics; 