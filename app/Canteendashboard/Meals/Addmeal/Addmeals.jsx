import React, { useState, useEffect } from "react";

const AddMealForm = () => {
  const [meal, setMeal] = useState({
    mealName: "",
    mealDescription: "",
    mealPrice: "",
    mealType: "Breakfast",
    mealQuantity: "",
    Canteenselect: "open",  // Default value set to "open"
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
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

    if (!validateForm()) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      // Upload image if a file is provided
      let uploadedImageURL = imageURL;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "my-uploads");

        const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload image.");

        const uploadResult = await uploadResponse.json();
        uploadedImageURL = uploadResult.secure_url;
      }

      const mealData = {
        ...meal,
        image: uploadedImageURL,
      };

      const response = await fetch("/api/addmeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add meal.");
      }

      alert("Meal added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }
  };

  const validateForm = () => {
    const { mealName, mealDescription, mealPrice, mealType, mealQuantity, selectCanteen } = meal;
    return mealName && mealDescription && mealPrice && mealType && mealQuantity && selectCanteen && (imageFile || imageURL);
  };

  const resetForm = () => {
    setMeal({
      mealName: "",
      mealDescription: "",
      mealPrice: "",
      mealType: "Breakfast",
      mealQuantity: "",
      selectCanteen: "open",  // Reset to default value
    });
    setImageFile(null);
    setImageURL(null);
    setLocalPreview(null);
  };

  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-[400px] mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Add Meal</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Meal Name"
          name="mealName"
          value={meal.mealName}
          onChange={handleInputChange}
        />
        <TextareaField
          label="Description"
          name="mealDescription"
          value={meal.mealDescription}
          onChange={handleInputChange}
        />
        <InputField
          label="Price"
          name="mealPrice"
          type="text"
          value={meal.mealPrice}
          onChange={handleInputChange}
        />
        <SelectField
          label="Category"
          name="mealType"
          options={["Breakfast", "Lunch", "Dinner"]}
          value={meal.mealType}
          onChange={handleInputChange}
        />
        <InputField
          label="Quantity"
          name="mealQuantity"
          type="number"
          value={meal.mealQuantity}
          onChange={handleInputChange}
        />
        <FileInputField
          label="Image"
          onChange={handleFileChange}
          previewURL={localPreview}
        />
        <div className="flex justify-between">
          <button type="button" className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

// Input Components for Reusability
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

export default AddMealForm;
