import { useMemo, useSyncExternalStore } from "react";
import { type SectionId, isSectionId } from "../sections";

// cada estado da v2 tem um endereço (D14): "/" é o início, "#explore" a órbita
// e "#about"… a seção aberta. O endereço é a fonte da verdade, então o "Voltar"
// do navegador desfaz uma ação por vez (D10) e um link abre direto na seção.
//
// O VersionProvider também empilha passos no histórico, mas guarda a versão no
// `state` da entrada, sem mudar o endereço: cada um lê um campo diferente
export type Route = { view: "idle" } | { view: "orbit" } | { view: "section"; section: SectionId };
export type Destination = "idle" | "explore" | SectionId;

// o pushState não avisa ninguém; este evento avisa os componentes da v2
const NAVIGATE_EVENT = "v2:navigate";

function subscribe(onChange: () => void) {
  const events = ["popstate", "hashchange", NAVIGATE_EVENT];
  events.forEach((event) => window.addEventListener(event, onChange));
  return () => events.forEach((event) => window.removeEventListener(event, onChange));
}

const getHash = () => decodeURIComponent(window.location.hash.slice(1));

export function parseRoute(hash: string): Route {
  if (isSectionId(hash)) return { view: "section", section: hash };
  if (hash === "explore") return { view: "orbit" };
  return { view: "idle" };
}

export function navigate(destination: Destination) {
  const { pathname, search } = window.location;
  window.history.pushState(null, "", destination === "idle" ? pathname + search : `#${destination}`);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash);
  return useMemo(() => parseRoute(hash), [hash]);
}
