"use client";
import React, { createContext, useState, useContext } from "react";
import { useAccount } from "wagmi";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { address } = useAccount();
  const [role, setRole] = useState(1); // 1 for Buyer, 2 for Seller

  return (
    <AppContext.Provider value={{ account: address, role, setRole }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
