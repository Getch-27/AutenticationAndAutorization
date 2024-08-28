import React, { createContext, useState, useContext } from 'react';

// Create the TokenContext
const TokenContext = createContext(null);

// Create a custom hook to use the TokenContext
export const useToken = () => {
  return useContext(TokenContext);
};

// Create a provider component
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
