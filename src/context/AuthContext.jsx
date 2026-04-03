import React, { createContext, useContext, useState } from 'react';

// Create a context specifically for handling user sessions context
const UserSessionContext = createContext();

// Custom hook to consume the internal user session
export const useUserSession = () => {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error("useUserSession must be wrapped within a UserSessionProvider");
  }
  return context;
};

// Provider component that wraps our app
export const AuthProvider = ({ children }) => {
  // We keep 'admin' as default state for dashboard demonstration
  const [activeRole, setActiveRole] = useState('admin');

  const contextValue = { activeRole, setActiveRole };

  return (
    <UserSessionContext.Provider value={contextValue}>
      {children}
    </UserSessionContext.Provider>
  );
};
