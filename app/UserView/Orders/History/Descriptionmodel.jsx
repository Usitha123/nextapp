import { Cross, X } from "lucide-react";
import React, { useState } from "react";

const UpdateDescriptionmodel = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState("active");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
      <div className=" bg-white rounded-xl w-80">
        <div className="">
          <h3 className="mb-4 flex text-center text-lg p-2 relative text-white rounded-t-xl bg-orange-500 ">Order info <span></span> <X className="absolute top-3 right-3 hover:text-black" onClick={() => {
              // Handle Save Action
              
              onClose();
            }}
              type="button"/></h3>
          
          <div className="flex p-6 justify-end mt-6 space-x-4">
          <h3>Meal info</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDescriptionmodel;
