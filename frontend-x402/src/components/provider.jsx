"use client";
import React from "react";

import { SessionProvider } from "next-auth/react";
import { AppContextProvider } from "./AppContext";

function AppProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      <AppContextProvider>{children}</AppContextProvider>
    </SessionProvider>
  );
}

export default AppProvider;