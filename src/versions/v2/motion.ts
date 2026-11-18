import { useEffect, useState, useSyncExternalStore } from "react";

// mesmo multiplicador do --tempo do CSS (D14), para os tempos controlados pelo script
export const TEMPO = 1;
export const ms = (base: number) => base * TEMPO;

const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function subscribeToReducedMotion(onChange: () => void) {
  reducedQuery.addEventListener("change", onChange);
  return () => reducedQuery.removeEventListener("change", onChange);
}

// com "menos movimento" no sistema, as digitações aparecem prontas
export function useReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, () => reducedQuery.matches);
}

type TypingOptions = {
  interval: number; // ms entre um passo e outro
  step?: number; // letras por passo
  delay?: number; // espera antes da primeira letra
};

// "digita" o texto: devolve o pedaço já escrito e se terminou.
// Um texto novo recomeça do zero
export function useTyping(text: string, { interval, step = 1, delay = 0 }: TypingOptions) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState({ text, count: 0 });
  if (progress.text !== text) setProgress({ text, count: 0 });
  const count = progress.text === text ? progress.count : 0;

  useEffect(() => {
    if (reduced) return;
    let typed = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        typed = Math.min(text.length, typed + step);
        setProgress({ text, count: typed });
        if (typed >= text.length) clearInterval(timer);
      }, interval);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [text, interval, step, delay, reduced]);

  if (reduced) return { typed: text, done: true };
  return { typed: text.slice(0, count), done: count >= text.length };
}
