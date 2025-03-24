import { createContext, useContext, useState } from "react";

interface LoadingContextProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };
  const value: LoadingContextProps = {
    isLoading,
    setIsLoading: setLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
