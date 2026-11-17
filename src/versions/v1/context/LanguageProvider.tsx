import { type ReactNode, useMemo, useState } from "react";
import { type Language, LanguageContext } from "./language";

// exceção ao congelamento da v1 (D4): o idioma inicial vem de ?lang=, repassado pela v2
function initialLanguage(): Language {
  const lang = new URLSearchParams(window.location.search).get("lang");
  return lang === "english" ? "english" : "portuguese";
}

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext value={value}>{children}</LanguageContext>
  );
}

export default LanguageProvider;
