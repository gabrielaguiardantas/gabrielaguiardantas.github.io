import { type ReactNode, useEffect, useMemo, useState } from "react";
import { type Language, LanguageContext } from "./language";

const HTML_LANG: Record<Language, string> = { portuguese: "pt-BR", english: "en" };

// o site abre no idioma preferido do navegador: português (pt-BR, pt-PT…) em PT, qualquer
// outro em inglês. A bandeira troca só durante a visita, sem guardar a escolha (D19)
function browserLanguage(): Language {
  const preferred = navigator.languages?.[0] ?? navigator.language;
  if (!preferred) return "portuguese";
  return preferred.toLowerCase().startsWith("pt") ? "portuguese" : "english";
}

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(browserLanguage);
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
