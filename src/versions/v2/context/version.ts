import { createContext, useContext } from "react";

export type Version = "v1" | "v2";

type VersionContextValue = {
  version: Version;
  setVersion: (version: Version) => void;
};

export const VersionContext = createContext<VersionContextValue | null>(null);

export function useVersion() {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
}
