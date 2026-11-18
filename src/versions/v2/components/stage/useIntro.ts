import { useEffect, useState } from "react";
import { ms, useReducedMotion } from "../../motion";

// as letras de "<GAD />", digitadas uma a uma
export const TAG = ["<", "G", "A", "D", " ", "/", ">"] as const;

// o convite (D14): ao carregar, o cursor pisca e "digita" o <GAD />, de forma irregular,
// como alguém digitando. Acontece em toda visita, mas só se a página abre no início:
// quem chega por um link de seção (#projects) já encontra o <GAD /> pronto.
// Sair do início (clicar no <GAD />) termina a digitação na hora
export function useIntro(idle: boolean) {
  const reduced = useReducedMotion();
  // quantas letras já apareceram; null quando a digitação terminou ou nem começou
  const [typed, setTyped] = useState<number | null>(() => (idle && !reduced ? 0 : null));
  if (typed !== null && (!idle || reduced)) setTyped(null);
  const typing = typed !== null;

  useEffect(() => {
    if (!typing) return;
    let count = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (count === TAG.length) {
        timer = setTimeout(() => setTyped(null), ms(250));
        return;
      }
      count += 1;
      setTyped(count);
      timer = setTimeout(step, ms(70 + Math.random() * 70));
    };
    timer = setTimeout(step, ms(900)); // o cursor pisca um pouco antes de começar
    return () => clearTimeout(timer);
  }, [typing]);

  return { typing, typed: typed ?? TAG.length };
}

export type Intro = ReturnType<typeof useIntro>;
