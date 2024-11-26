import React, { createContext, useState, useContext, ReactNode } from 'react';

//Defining context
interface AppContextProps {
  accountID: number | null;
  setAccountID: React.Dispatch<React.SetStateAction<number | null>>;
}


interface AppProviderProps {
  children: ReactNode;
}

//Creating the context
const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  //State to store the accountID
  const [accountID, setAccountID] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ accountID, setAccountID }}>
      {children}
    </AppContext.Provider>
  );
};

//Use the context anywhere
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};