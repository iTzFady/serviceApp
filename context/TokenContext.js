import { getToken, removeToken, setToken } from "@/utility/storage";
import { createContext, useContext, useEffect, useState } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await getToken();
      if (savedToken) setTokenState(savedToken);
      setLoading(false);
    };
    loadToken();
  }, []);

  const saveToken = async (newToken) => {
    await setToken(newToken);
    setTokenState(newToken);
  };
  const clearToken = async () => {
    await removeToken();
    setTokenState(null);
  };

  return (
    <TokenContext.Provider
      value={{ token, setToken: saveToken, removeToken: clearToken, loading }}
    >
      {children}
    </TokenContext.Provider>
  );
};
export const useToken = () => useContext(TokenContext);
