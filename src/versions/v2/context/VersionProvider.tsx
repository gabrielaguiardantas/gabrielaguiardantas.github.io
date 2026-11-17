import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type Language, useLanguage } from "./language";
import { type Version, VersionContext } from "./version";
import styles from "./VersionProvider.module.css";

type HistoryState = { version?: Version } | null;

// versão ativa só durante a visita: um reload volta para a v2 (D3)
function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<Version>("v2");
  // idioma com que a v1 foi carregada; null enquanto ela nunca foi aberta
  const [frameLanguage, setFrameLanguage] = useState<Language | null>(null);
  const { language } = useLanguage();
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const isV1 = version === "v1";

  // cada troca é um passo no histórico, então o "Voltar" do navegador desfaz
  // uma ação por vez: as seções visitadas na v1 e, por fim, a ida a 2023 (D10)
  const switchVersion = useCallback((next: Version) => {
    window.history.pushState({ version: next } satisfies HistoryState, "");
    // abrir a v1 pelo card usa o idioma atual da v2; se mudou, a v1 recarrega nele
    if (next === "v1") setFrameLanguage(languageRef.current);
    setVersion(next);
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const next = (event.state as HistoryState)?.version === "v1" ? "v1" : "v2";
      // "Avançar" depois de um reload pode reabrir a v1 antes de ela existir
      if (next === "v1") setFrameLanguage((current) => current ?? languageRef.current);
      setVersion(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // o botão "Voltar para 2026" da v1 manda { type: "switch-version", version: "v2" };
  // só vale a mensagem que vem do próprio iframe, na mesma origem
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!frameRef.current || event.source !== frameRef.current.contentWindow) return;
      if (event.data?.type === "switch-version" && event.data.version === "v2") switchVersion("v2");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [switchVersion]);

  // com a v1 na frente, a v2 fica montada atrás (preserva a rolagem),
  // mas inerte (sem foco nem leitor de tela) e sem barra de rolagem própria
  useEffect(() => {
    if (!isV1) return;
    const root = document.getElementById("root")!;
    const html = document.documentElement;
    root.inert = true;
    html.style.overflow = "hidden";
    return () => {
      root.inert = false;
      html.style.overflow = "";
    };
  }, [isV1]);

  const value = useMemo(() => ({ version, switchVersion }), [version, switchVersion]);

  // depois de aberta, a v1 só é escondida, nunca destruída: assim as entradas de
  // histórico criadas pela nav dela continuam válidas para o "Voltar" (D10)
  return (
    <VersionContext value={value}>
      {children}
      {frameLanguage &&
        createPortal(
          <iframe
            key={frameLanguage}
            ref={frameRef}
            className={isV1 ? styles.frame : `${styles.frame} ${styles.hidden}`}
            inert={!isV1}
            src={`/v1.html?lang=${frameLanguage}`}
            title={frameLanguage === "portuguese" ? "Portfólio, versão 1.0 (2023)" : "Portfolio, version 1.0 (2023)"}
          />,
          document.body,
        )}
    </VersionContext>
  );
}

export default VersionProvider;
