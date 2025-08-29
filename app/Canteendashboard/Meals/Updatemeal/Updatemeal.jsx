'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const UpdateCanteen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) {
      setError('Invalid or missing ID.');
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`/api/allmeallist?id=${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject('Failed to fetch meal data')))
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
      const reader = new FileReader();
      reader.onloadend = () => setLocalPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  // ---------- API Calls ----------
  const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my-uploads");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let updatedMeal = { ...meal };

      // If a new file is selected, upload it first
      if (file) {
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
          updatedMeal.mealImage = imageUrl; // Assuming the field name is mealImage
        }
      }

      const res = await fetch(`/api/updatemeal?id=${meal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMeal),
      });

      if (!res.ok) throw new Error(await res.text());

      await res.json();
      router.push('/Canteendashboard/Meals/Breakfast');
    } catch (err) {
      setError(err.message || 'Failed to update meal.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!meal) return <div>No meal found to update.</div>;

  return (
    <div className="w-[500px] p-6 mx-auto text-gray-200 bg-[#2B2623] rounded-md">
      <h2 className="mb-4 text-xl font-bold">Update Meal</h2>

      <div className="text-sm bg-[#2B2623] rounded-lg shadow-lg  mx-auto">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Meal Name"
            name="mealName"
            value={meal.mealName}
            onChange={handleChange}
          />
          <TextareaField
            label="Description"
            name="mealDescription"
            value={meal.mealDescription}
            onChange={handleChange}
          />
          <SelectField
            label="Category"
            name="mealType"
            options={['Breakfast', 'Lunch', 'Dinner']}
            value={meal.mealType}
            onChange={handleChange}
          />

          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <InputField
              label="Price"
              name="mealPrice"
              type="text"
              value={meal.mealPrice}
              onChange={handleChange}
            />
            <InputField
              label="Quantity"
              name="mealQuantity"
              type="number"
              value={meal.mealQuantity}
              onChange={handleChange}
            />
          </div>

          <FileInputField
            label="Image"
            onChange={handleFileChange}
            previewURL={localPreview || meal.mealImage} // Show existing image if no new preview
            existingImage={meal.mealImage}
          />

          <div className="flex justify-between text-sm">
            <Link
              href="/Canteendashboard/Meals/Breakfast"
              className="px-4 py-1 m-2 text-orange-500 border border-orange-500 rounded-xl bg-[#3B3737] hover:bg-black transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1 m-2 text-white transition bg-orange-500 rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Reusable fields — styled to match AddMealForm ────────────────────────────
const InputField = ({ label, name, type = 'text', value, onChange }) => (
  <div className="mb-4">
    <label className="block p-1 text-orange-500">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md"
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label className="block p-1 text-orange-500">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md resize-none"
    />
  </div>
);

const SelectField = ({ label, name, options, value, onChange }) => (
  <div className="mb-4">
    <label className="block p-1 text-orange-500">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const FileInputField = ({ label, onChange, previewURL, existingImage }) => (
  <div className="mb-4">
    <label className="block p-1 text-orange-500">{label}</label>
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="w-full h-11 p-2 text-gray-300 bg-[#3B3737] rounded-md
                 file:cursor-pointer file:p-0.5 file:px-2
                 file:rounded-md file:border-0 file:text-white
                 file:bg-[#5E5E63CF] hover:file:bg-gray-600"
    />
    {previewURL && (
      <div className="mt-4">
        <p className="mb-2 text-sm text-gray-400">
          {previewURL === existingImage ? 'Current Image:' : 'New Image Preview:'}
        </p>
        <img src={previewURL} alt="Preview" className="h-[200px] w-auto mx-auto rounded-lg shadow" />
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