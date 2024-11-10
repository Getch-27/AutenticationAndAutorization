import React, { createContext, useState, useContext } from 'react';
/* eslint-disable react/prop-types */
// TokenConte
const TokenContext = createContext(null);

export const useToken = () => {
  return useContext(TokenContext);
};

//provider component
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
