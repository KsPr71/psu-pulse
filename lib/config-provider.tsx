import { PCConfiguration, PSUCalculation } from "@/shared/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface ConfigContextValue {
  config: PCConfiguration;
  setConfig: (config: PCConfiguration) => void;
  result: PSUCalculation | null;
  setResult: (result: PSUCalculation | null) => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PCConfiguration>({
    processor: null,
    gpu: null,
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

  return (
    <ConfigContext.Provider value={{ config, setConfig, result, setResult }}>
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
