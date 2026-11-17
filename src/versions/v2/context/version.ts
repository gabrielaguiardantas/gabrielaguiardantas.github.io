import { createContext, useContext } from "react";

export type Version = "v1" | "v2";

type VersionContextValue = {
  version: Version;
  // troca a versão e registra o passo no histórico do navegador (D10)
  switchVersion: (version: Version) => void;
};

export const VersionContext = createContext<VersionContextValue | null>(null);

export function useVersion() {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
}
