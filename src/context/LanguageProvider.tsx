import { ReactNode, useMemo, useState } from "react";
import { Language, LanguageContext } from "./language";

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("portuguese");
  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export default LanguageProvider;
