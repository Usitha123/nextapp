"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

// ✅ Main Component
const AddMealForm = () => {
  const { data: session } = useSession();

  // Initial meal state
  const getInitialMealState = () => ({
    mealName: "",
    mealDescription: "",
    mealPrice: "",
    mealType: "Breakfast",
    mealQuantity: "",
    selectCanteen: session?.user?.canteenName || "",
  });

  const [meal, setMeal] = useState(getInitialMealState);
  const [imageFile, setImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ---------- Handlers ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.');
        return;
      }

      setImageFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    if (!isFormValid()) {
      alert("Please fill out all fields correctly.");
      setIsSubmitting(false);
      return;
    }

    try {
      const uploadedImageURL = await uploadImage(imageFile);
      const mealData = { ...meal, image: uploadedImageURL };

      await submitMealData(mealData);

      setSubmitSuccess(true);
      alert("Meal added successfully!");
      
      // Auto reset form after successful submission
      setTimeout(() => {
        resetForm();
        setSubmitSuccess(false);
      }, 1500); // Wait 1.5 seconds to show success message
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message || "There was an error submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Validation ----------
  const isFormValid = () => {
    const { mealName, mealDescription, mealPrice, mealQuantity } = meal;
    
    // Check required fields
    if (!mealName?.trim() || !mealDescription?.trim() || !mealPrice || !mealQuantity) {
      return false;
    }

    // Validate price
    const price = parseFloat(mealPrice);
    if (isNaN(price) || price <= 0) {
      return false;
    }

    // Validate quantity
    const quantity = parseInt(mealQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      return false;
    }

    // Check image
    return !!(imageFile || localPreview);
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

  const submitMealData = async (mealData) => {
    try {
      const response = await fetch("/api/addmeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to add meal to database");
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to save meal: ${error.message}`);
    }
  };

  // ---------- Reset ----------
  const resetForm = () => {
    setMeal(getInitialMealState());
    setImageFile(null);
    
    // Clean up preview URL to prevent memory leaks
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Clean up preview URL on component unmount
  React.useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  // ---------- JSX ----------
  return (
    <div className="text-gray-200 bg-[#2B2623] p-6 rounded-lg shadow-lg w-[500px] mx-auto">
      {submitSuccess && (
        <div className="p-3 mb-4 bg-green-600 border border-green-500 rounded-md bg-opacity-20">
          <p className="text-sm font-medium text-green-400">✅ Meal added successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField 
          label="Meal Name" 
          name="mealName" 
          value={meal.mealName} 
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
        />
        
        <TextareaField 
          label="Description" 
          name="mealDescription" 
          value={meal.mealDescription} 
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
        />
        
        <SelectField 
          label="Category" 
          name="mealType" 
          options={["Breakfast", "Lunch", "Dinner"]} 
          value={meal.mealType} 
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        
        <div className="grid grid-cols-[2fr_1fr] gap-2">
          <InputField 
            label="Price (Rs.)" 
            name="mealPrice" 
            type="number" 
            step="0.01"
            min="0.01"
            value={meal.mealPrice} 
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
          <InputField 
            label="Quantity" 
            name="mealQuantity" 
            type="number" 
            min="1"
            value={meal.mealQuantity} 
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <FileInputField 
          label="Image *" 
          onChange={handleFileChange} 
          previewURL={localPreview}
          disabled={isSubmitting}
        />

        <div className="flex justify-between mt-6 text-sm">
          <Link
            href="/Canteendashboard/Meals/Breakfast"
            className="px-4 py-2 text-orange-500 border border-orange-500 rounded-xl bg-[#3B3737] hover:bg-black transition disabled:opacity-50"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            className="px-4 py-2 text-white transition bg-orange-500 rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? "Adding..." : "Add Meal"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ✅ Reusable Components
const InputField = ({ label, name, type = "text", value, onChange, required = false, disabled = false, ...props }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
      required={required}
      disabled={disabled}
      {...props}
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange, required = false, disabled = false }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={3}
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
      required={required}
      disabled={disabled}
    />
  </div>
);

const SelectField = ({ label, name, options, value, onChange, disabled = false }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const FileInputField = ({ label, onChange, previewURL, disabled = false }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="w-full h-11 p-2 text-gray-300 bg-[#3B3737] rounded-md 
                 file:cursor-pointer file:p-1 file:px-3 file:rounded-md 
                 file:border-0 file:text-white file:bg-[#5E5E63CF] hover:file:bg-orange-500
                 focus:outline-none focus:ring-2 focus:ring-orange-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
    />
    {previewURL && (
      <div className="mt-4">
        <p className="mb-2 text-sm text-gray-400">Preview:</p>
        <img
          src={previewURL}
          alt="Meal preview"
          className="w-auto h-[180px] mx-auto rounded-lg shadow-md"
        />
      </div>
    )}
  </div>
);

export default AddMealForm;