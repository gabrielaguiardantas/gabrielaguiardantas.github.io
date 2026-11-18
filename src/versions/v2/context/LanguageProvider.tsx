import { type ReactNode, useEffect, useMemo, useState } from "react";
import { type Language, LanguageContext } from "./language";

const HTML_LANG: Record<Language, string> = { portuguese: "pt-BR", english: "en" };

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("portuguese");
  const value = useMemo(() => ({ language, setLanguage }), [language]);

  // leitores de tela e o navegador (hifenização, tradução) seguem o idioma da página
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language];
  }, [language]);

  return (
    <LanguageContext value={value}>{children}</LanguageContext>
  );
}

export default LanguageProvider;
