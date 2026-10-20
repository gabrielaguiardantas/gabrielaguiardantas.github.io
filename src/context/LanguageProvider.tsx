import { ReactNode, useMemo, useState } from "react";
import { Language, LanguageContext } from "./language";

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("portuguese");
  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext value={value}>{children}</LanguageContext>
  );
}

export default LanguageProvider;
