'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const UpdateCanteen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null); // New state for the selected file
  const [localPreview, setLocalPreview] = useState(null); // New state for the image preview

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) {
      setError('Invalid or missing ID.');
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`/api/allmeallist?id=${id}`)
      .then((res) => res.ok ? res.json() : Promise.reject('Failed to fetch meal data'))
      .then(setMeal)
      .catch((err) => setError(err.message || 'Error fetching meal details'))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setLocalPreview(fileReader.result); // Set the preview URL
      };
      fileReader.readAsDataURL(selectedFile); // Read the file as data URL for preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/updatemeal?id=${meal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meal),
      });

      if (!response.ok) throw new Error(await response.text());

      const updatedMeal = await response.json();
      console.log('Canteen updated:', updatedMeal);

      router.push('/Canteendashboard/Meals/Breakfast');
    } catch (err) {
      setError(err.message || 'Failed to update canteen.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!meal) return <div>No meal found to update.</div>;

  return (
    <div className="w-full max-w-lg p-6 mx-auto text-white bg-gray-900 rounded-md">
      <h2 className="mb-4 text-xl font-bold">Update Meal</h2>
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-[400px] mx-auto">
        <form onSubmit={handleSubmit}>
          <InputField label="Meal Name" name="mealName" value={meal.mealName} onChange={handleChange} />
          <TextareaField label="Description" name="mealDescription" value={meal.mealDescription} onChange={handleChange} />
          <SelectField label="Category" name="mealType" options={["Breakfast", "Lunch", "Dinner"]} value={meal.mealType} onChange={handleChange} />
          <div className="grid grid-cols-[2fr_1fr] gap-2">
            <InputField label="Price" name="mealPrice" type="text" value={meal.mealPrice} onChange={handleChange} />
            <InputField label="Quantity" name="mealQuantity" type="number" value={meal.mealQuantity} onChange={handleChange} />
          </div>
          <FileInputField label="Image" onChange={handleFileChange} previewURL={localPreview} />
          <div className="flex justify-between">
          <Link href="/Canteendashboard/Meals/Breakfast" className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700">
                      Cancel
                    </Link>
            <button type="submit" className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600">Update</button>
         
            
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Components
const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
    />
  </div>
);

const SelectField = ({ label, name, options, value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const FileInputField = ({ label, onChange, previewURL }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input
      type="file"
      onChange={onChange}
      className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-orange-500"
    />
    {previewURL && (
      <div className="mt-4">
        <p className="mb-2 text-sm text-gray-400">Preview:</p>
        <img src={previewURL} alt="Preview" className="w-full rounded-lg shadow" />
      </div>
    )}
  </div>
);

const SuspendedUpdateCanteen = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <UpdateCanteen />
  </Suspense>
);

export default SuspendedUpdateCanteen;
