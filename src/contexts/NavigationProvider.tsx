import React, { createContext, useContext, ReactNode, useState } from "react";
import { TSteps } from "../types/types";
import { steps } from "../data/data";

// Define the type for your context
interface NavigationContextProps {
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  currentStep: TSteps;
  setCurrentStep: React.Dispatch<React.SetStateAction<TSteps>>;
  steps: TSteps[];
  setDone: React.Dispatch<React.SetStateAction<boolean>>;
  done: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setPersonalInfoStep: React.Dispatch<React.SetStateAction<number>>;
  personalInfoStep: number;
}

// Create the context with an initial value
const NavigationContext = createContext<NavigationContextProps | undefined>(
  undefined
);

// Define a custom hook for using the Navigation context in components
const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

// Create a provider component that will wrap your app
interface NavigationProviderProps {
  children: ReactNode;
}

const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<TSteps>(steps[0]);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [personalInfoStep, setPersonalInfoStep] = useState(0);
  const contextValue: NavigationContextProps = {
    isChecked,
    setIsChecked,
    setCurrentStep,
    currentStep,
    steps: steps || [],
    done,
    setDone,
    error,
    setError,
    personalInfoStep,
    setPersonalInfoStep,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationProvider, useNavigation };
