import {
    PCConfiguration,
    PSUCalculation,
    PSUCalculationWithOC,
} from "@/shared/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface ConfigContextValue {
  config: PCConfiguration;
  setConfig: (config: PCConfiguration) => void;
  result: PSUCalculation | null;
  resultWithOC: PSUCalculationWithOC | null;
  setResult: (result: PSUCalculation | null) => void;
  setResultWithOC: (result: PSUCalculationWithOC | null) => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PCConfiguration>({
    processor: null,
    gpu: null,
    motherboard: null,
    cooling: null,
    ramType: null,
    ramModules: 0,
    storage: [],
    pciExpress1x4: 0,
    pciExpress1x8: 0,
    pciExpress1x16: 0,
    opticalDrives: 0,
    fans: 0,
  });

  const [result, setResult] = useState<PSUCalculation | null>(null);
  const [resultWithOC, setResultWithOC] = useState<PSUCalculationWithOC | null>(null);

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        result,
        resultWithOC,
        setResult,
        setResultWithOC,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
}
