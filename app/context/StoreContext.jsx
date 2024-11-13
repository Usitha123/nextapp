"use client";

import { createContext, useState } from "react";
import { food_list as initialFoodList } from "../assets/assets"; // Import your food list here

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [food_list] = useState(initialFoodList); // Assuming food_list is static; use state if dynamic

  const contextValue = {
    food_list,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
