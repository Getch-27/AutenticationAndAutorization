import React, { createContext, useState, useContext } from 'react';

// TokenContext
const TokenContext = createContext(null);

export const useToken = () => {
  return useContext(TokenContext);
};

//provider componen
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
