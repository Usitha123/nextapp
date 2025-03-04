'use client';

import { useState, useEffect, Suspense } from 'react';
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
    <div className="bg-[#2B2623] p-6 rounded-md shadow-lg w-full mx-auto">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Image Preview */}
        <div>
          {canteen.image && (
            <div>
              <label className="block text-sm text-orange-500 mb-1">Image Preview</label>
              <img
                src={canteen.image}
                alt="Canteen Image"
                className="object-cover w-full h-80 rounded-md"
              />
            </div>
          )}
        </div>
  
        {/* Right Column - Form */}
        <div>
          {error && <p className="text-red-500">{error}</p>}
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {['Canteen Name', 'Business Email', 'Open Hour', 'Closed Hour', 'Phone Number'].map((field) => (
                <div key={field}>
                  <label className="block text-sm text-orange-500 mb-1">{field}</label>
                  <input
                    type={field === 'Open Hour' || field === 'Closed Hour' ? 'time' : 'text'}
                    name={field}
                    value={canteen[field]}
                    onChange={handleChange}
                    required
                    className="w-full p-2 text-gray-300 bg-[#3B3737] border border-gray-600 rounded-md"
                  />
                </div>
              ))}
  
              {/* Opening Date Field */}
              <div>
                <label className="block text-sm text-orange-500 mb-1">Opening Date</label>
                <input
                  type="date"
                  name="openingDate"
                  value={canteen.openingDate ? canteen.openingDate.substring(0, 10) : ''}
                  onChange={handleChange}
                  required
                  className="w-full p-2 text-gray-300 bg-[#3B3737] border border-gray-600 rounded-md"
                />
              </div>
  
              {['status', 'ownerstatus'].map((field) => (
                <div key={field}>
                  <label className="block text-sm text-orange-500 mb-1">{field}</label>
                  <select
                    name={field}
                    value={canteen[field]}
                    onChange={handleChange}
                    className="w-full p-2 text-gray-300 bg-[#3B3737] border border-gray-600 rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              ))}
            </div>
  
            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-orange-500 bg-[#3B3737] border border-orange-500 rounded-xl hover:bg-black transition"
              >
                {loading ? 'Updating...' : 'Update Canteen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Wrap the UpdateCanteen component in Suspense to handle the async loading state
const SuspendedUpdateCanteen = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <UpdateCanteen />
  </Suspense>
);

export default SuspendedUpdateCanteen;
