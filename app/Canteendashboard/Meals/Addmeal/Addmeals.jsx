import React, { useState } from "react";
import { useSession } from 'next-auth/react';
// Form Component
const AddMealForm = () => {
  const { data: session, status } = useSession();
  const [meal, setMeal] = useState({
    mealName: "",
    mealDescription: "",
    mealPrice: "",
    mealType: "Breakfast",
    mealQuantity: "",
    selectCanteen: session?.user?.canteenName,  // Default value set to "open"
  });
  const [imageFile, setImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      const uploadedImageURL = await uploadImage(imageFile);

      const mealData = { ...meal, image: uploadedImageURL };
      await submitMealData(mealData);

      alert("Meal added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }
  };

  const isFormValid = () => {
    const { mealName, mealDescription, mealPrice, mealType, mealQuantity, selectCanteen } = meal;
    return mealName && mealDescription && mealPrice && mealType && mealQuantity && selectCanteen && (imageFile || localPreview);
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my-uploads");

    const response = await fetch("https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload image.");

    const { secure_url } = await response.json();
    return secure_url;
  };

  const submitMealData = async (mealData) => {
    const response = await fetch("/api/addmeal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mealData),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to add meal.");
    }
  };

  const resetForm = () => {
    setMeal({
      mealName: "",
      mealDescription: "",
      mealPrice: "",
      mealType: "Breakfast",
      mealQuantity: "",
      selectCanteen: "",  // Reset to default value
    });
    setImageFile(null);
    setLocalPreview(null);
  };

  return (
    <div className="text-gray-200 bg-[#2B2623] p-6 rounded-lg shadow-lg w-[400px] mx-auto">
      {/* <h2 className="mb-6 text-2xl font-bold">Add Meal</h2> */}
      <form onSubmit={handleSubmit}>
        <InputField label="Meal Name" name="mealName" value={meal.mealName} onChange={handleInputChange} />
        <TextareaField label="Description" name="mealDescription" value={meal.mealDescription} onChange={handleInputChange} />
        <SelectField label="Category" name="mealType" options={["Breakfast", "Lunch", "Dinner"]} value={meal.mealType} onChange={handleInputChange} />
        <div className="grid grid-cols-[2fr_1fr] gap-2">        
          <InputField label="Price" name="mealPrice" type="text" value={meal.mealPrice} onChange={handleInputChange} />
          <InputField label="Quantity" name="mealQuantity" type="number" value={meal.mealQuantity} onChange={handleInputChange} />
        </div>
        <FileInputField label="Image" onChange={handleFileChange} previewURL={localPreview} />
        <div className="flex justify-between text-sm">
          <button type="button" className="px-4 py-1 m-2 text-orange-500 border border-orange-500 rounded-xl bg-[#3B3737] hover:bg-black transition">
            Cancel
          </button>
          <button type="submit" className="px-4 py-1 m-2 text-white bg-orange-500 rounded-xl hover:bg-orange-400 transition">
            Add
          </button>
        </div>
      </form>
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
      className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
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
      className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
    ></textarea>
  </div>
);

const SelectField = ({ label, name, options, value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
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
      className="w-full h-11 p-2 text-gray-300 bg-[#3B3737]  rounded-md  file:cursor-pointer file:p-0.5 file:px-2   file:rounded-md file:border-0 file:text-white file:bg-[#5E5E63CF] hover:file:bg-orange-500"
    />
    {previewURL && (
      <div className="mt-4">
        <p className="mb-2 text-sm text-gray-400">Preview:</p>
        <img src={previewURL} alt="Preview" className="w-full rounded-lg shadow" />
      </div>
    )}
  </div>
);

export default AddMealForm;
