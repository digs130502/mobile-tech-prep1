import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface AppContextProps {
  accountID: number | null;
  setAccountID: React.Dispatch<React.SetStateAction<number | null>>;
}

// Define the type for the provider's children
interface AppProviderProps {
  children: ReactNode;  // This allows the provider to accept children
}

// Create the context
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State to store the accountID
  const [accountID, setAccountID] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ accountID, setAccountID }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context in any component
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};