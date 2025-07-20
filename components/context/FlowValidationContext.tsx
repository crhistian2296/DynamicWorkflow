import { AppNodeMissingInputs } from "@/types/appNode";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type FlowvalidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
};

export const FlowValidationContext =
  createContext<FlowvalidationContextType | null>(null);

export const FlowValidationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    []
  );

  const clearErrons = () => {
    setInvalidInputs([]);
  };

  return (
    <FlowValidationContext.Provider
      value={{ clearErrors: clearErrons, invalidInputs, setInvalidInputs }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
};
