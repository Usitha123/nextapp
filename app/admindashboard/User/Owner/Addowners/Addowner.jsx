"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddOwnerForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [owner, setOwner] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nicNumber: "",
    password: "",
    confirmPassword: "",
    selectcanteen: "",
  });
  const [canteens, setCanteens] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCanteens();
  }, []);

  const fetchCanteens = async () => {
    try {
      const res = await fetch("/api/allcanteenslist");
      if (!res.ok) throw new Error("Failed to fetch canteens");
      const data = await res.json();
      const inactiveCanteens = data.filter(
        (canteen) => canteen.ownerstatus === "Inactive"
      );
      setCanteens(inactiveCanteens);
    } catch (err) {
      setError("Failed to load canteens.");
    }
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setOwner((prev) => ({ ...prev, [name]: value }));

  const handleFileChange = ({ target: { files } }) => {
    const file = files[0];
    if (file) {
      setImageFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const isFormValid = () => {
    const { password, confirmPassword, ...requiredFields } = owner;
    const hasAllFields = Object.values(requiredFields).every(Boolean);
    return hasAllFields && password === confirmPassword && imageFile;
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my-uploads");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload",
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("Image upload failed.");
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please fill out all fields correctly.");
      return;
    }

    setIsLoading(true);
    try {
      const { secure_url } = await uploadImage(imageFile);

      const response = await fetch("/api/addowner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...owner, image: secure_url }),
      });

      if (!response.ok) throw new Error(await response.text());

      alert("Owner added successfully!");
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Error occurred while adding owner.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setOwner({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      nicNumber: "",
      password: "",
      confirmPassword: "",
      selectcanteen: "",
    });
    setImageFile(null);
    setLocalPreview(null);
  };

  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-[400px] mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Add Owner</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        {Object.keys(owner).map((key) =>
          key === "selectcanteen" ? (
            <select
              key={key}
              name={key}
              value={owner[key]}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 text-white bg-gray-700 rounded focus:outline-none"
            >
              <option value="">Select Canteen</option>
              {canteens.map(({ _id, canteenName }) => (
                <option key={_id} value={_id}>
                  {canteenName}
                </option>
              ))}
            </select>
          ) : (
            <input
              key={key}
              type={key.includes("password") ? (showPassword ? "text" : "password") : "text"}
              name={key}
              value={owner[key]}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 text-white bg-gray-700 rounded focus:outline-none"
            />
          )
        )}
        {localPreview && <img src={localPreview} alt="Preview" />}
        <button
          type="submit"
          className={`px-4 py-2 rounded ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-orange-500"}`}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddOwnerForm;
