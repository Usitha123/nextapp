'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'; // Import the useSearchParams hook

const UpdateCanteen = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get the search params (query parameters)
  const [canteen, setCanteen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debug: Log the searchParams object to see if ID exists
    console.log('Search Params:', searchParams);

    // Extract 'id' from the query string
    const id = searchParams.get('id');
    if (!id) {
      setError('Invalid or missing ID.');
      setLoading(false);
      console.error('Error: ID is missing or invalid.');
      return;
    }

    // Start loading
    setLoading(true);

    // Fetch canteen details from the API using the ID from the searchParams
    fetch(`/api/allcanteenslist?id=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch canteen data');
        }
        return res.json();
      })
      .then((data) => {
        setCanteen(data); // Set fetched data to state
      })
      .catch((err) => {
        setError(err.message || 'Error fetching canteen details.');
      })
      .finally(() => {
        setLoading(false); // End loading state
      });
  }, [searchParams]); // Re-run the effect when searchParams change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCanteen((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send updated canteen data to the API
      const response = await fetch(`/api/updatecanteen?id=${canteen._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(canteen),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const updatedCanteen = await response.json();
      console.log('Canteen updated:', updatedCanteen);

      // Redirect to the canteens list after successful update
      router.push('/admindashboard/Canteens/AllCanteens');
    } catch (err) {
      setError(err.message || 'Failed to update canteen.');
    } finally {
      setLoading(false);
    }
  };

  // If loading, show loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If error occurred, show error message
  if (error) {
    return <div>{error}</div>;
  }

  // If no canteen is found, show no data message
  if (!canteen) {
    return <div>No canteen found to update.</div>;
  }

  return (
    <div className="w-full max-w-lg p-6 mx-auto text-white bg-gray-900 rounded-md">
      <h2 className="mb-4 text-xl font-bold">Update Canteen</h2>

      {/* Image preview section */}
      {canteen.image && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300">Image Preview</label>
          <img src={canteen.image} alt="Canteen Image" className="object-cover w-full h-48 mt-2 rounded-md" />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['canteenName', 'businessEmail', 'openHour', 'closedHour', 'phoneNumber'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-300">{field}</label>
            <input
              type={field === 'openHour' || field === 'closedHour' ? 'time' : 'text'}
              name={field}
              value={canteen[field]}
              onChange={handleChange}
              required
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            />
          </div>
        ))}

        {/* Handle openingDate field separately */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Opening Date</label>
          <input
            type="date"
            name="openingDate"
            value={canteen.openingDate ? canteen.openingDate.substring(0, 10) : ''} // Ensure correct date format
            onChange={handleChange}
            required
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
          />
        </div>

        {['status', 'ownerstatus'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-300">{field}</label>
            <select
              name={field}
              value={canteen[field]}
              onChange={handleChange}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-green-600 rounded-md"
          >
            {loading ? 'Updating...' : 'Update Canteen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCanteen;
