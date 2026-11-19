import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import TimeTravel from "../components/time-travel";
import { useReducedMotion } from "../motion";
import { type Language, useLanguage } from "./language";
import { type Version, VersionContext } from "./version";
import styles from "./VersionProvider.module.css";

type HistoryState = { version?: Version } | null;

// o aviso de chegada a cada época, para o leitor de tela: o NVDA não anuncia o foco no
// iframe da v1, e a viagem ficava em silêncio
const ARRIVAL: Record<Language, Record<Version, string>> = {
  portuguese: { v1: "Você está na versão 1.0 do portfólio, de 2023.", v2: "De volta à versão 2.0, de 2026." },
  english: { v1: "You are on version 1.0 of the portfolio, from 2023.", v2: "Back to version 2.0, from 2026." },
};

// uma promessa que outro trecho resolve depois (aqui, o load do iframe da v1)
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

// versão ativa só durante a visita: um reload volta para a v2 (D3)
function VersionProvider({ children }: { children: ReactNode }) {
  // a versão pedida (card, botão ou histórico) e a que está na tela: entre as duas,
  // roda a volta no tempo (D18), e a da tela só troca por trás da camada do efeito
  const [version, setVersion] = useState<Version>("v2");
  const [shown, setShown] = useState<Version>("v2");
  // cada troca de época ganha um número: uma troca no meio do efeito recomeça ele
  const [travel, setTravel] = useState<{ id: number; to: Version } | null>(null);
  // idioma com que a v1 foi carregada; null enquanto ela nunca foi aberta
  const [frameLanguage, setFrameLanguage] = useState<Language | null>(null);
  // o texto fica fixo no idioma da viagem: trocar o idioma depois não repete o aviso
  const [announcement, setAnnouncement] = useState("");
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const isV1 = shown === "v1";

  // o load de cada iframe (um por idioma): o efeito espera por ele antes de mostrar a v1.
  // Um iframe novo (outro idioma) começa uma espera nova
  const [frameLoaded, setFrameLoaded] = useState(() => ({ language: frameLanguage, ...deferred() }));
  if (frameLoaded.language !== frameLanguage) setFrameLoaded({ language: frameLanguage, ...deferred() });

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

  // a versão pedida mudou: começa (ou recomeça) a viagem até ela
  const [lastVersion, setLastVersion] = useState(version);
  if (version !== lastVersion) {
    setLastVersion(version);
    setTravel((current) => ({ id: (current?.id ?? 0) + 1, to: version }));
  }

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
  // mas inerte (sem foco nem leitor de tela) e sem barra de rolagem própria.
  // O foco entra na v1, para o teclado já navegar nela, e ao voltar retorna ao botão que a abriu
  useEffect(() => {
    if (!isV1) return;
    const root = document.getElementById("root")!;
    const html = document.documentElement;
    const active = document.activeElement;
    const trigger = active instanceof HTMLElement && active !== document.body ? active : null;
    root.inert = true;
    html.style.overflow = "hidden";
    frameRef.current?.focus();
    return () => {
      root.inert = false;
      html.style.overflow = "";
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [isV1]);

  const value = useMemo(() => ({ version, switchVersion }), [version, switchVersion]);

  // na ida, a v1 aparece só depois de carregar; na volta, a v2 está sempre pronta
  const ready = useCallback(
    (to: Version) => (to === "v1" ? frameLoaded.promise : Promise.resolve()),
    [frameLoaded],
  );

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
            onLoad={frameLoaded.resolve}
          />,
          document.body,
        )}
      {travel &&
        createPortal(
          <TimeTravel
            key={travel.id}
            to={travel.to}
            ready={() => ready(travel.to)}
            reduced={reduced}
            language={language}
            onSwap={() => setShown(travel.to)}
            onDone={() => {
              setTravel((current) => (current?.id === travel.id ? null : current));
              setAnnouncement(ARRIVAL[language][travel.to]);
            }}
          />,
          document.body,
        )}
      {/* fora do #root, que fica inerte com a v1 na frente; existe desde o início, porque o
          leitor de tela só anuncia mudanças numa região que já estava na página */}
      {createPortal(
        <p role="status" className={styles.announcer}>
          {announcement}
        </p>,
        document.body,
      )}
    </VersionContext>
  );
}

export default VersionProvider;
