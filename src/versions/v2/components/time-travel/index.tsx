import { useEffect, useRef } from "react";
import type { Language } from "../../context/language";
import type { Version } from "../../context/version";
import { ms } from "../../motion";
import styles from "./time-travel.module.css";

const TEXT = {
  portuguese: { v1: "// voltando no tempo", v2: "// de volta ao presente", loading: "// carregando 2023…" },
  english: { v1: "// going back in time", v2: "// back to the present", loading: "// loading 2023…" },
} satisfies Record<Language, Record<string, string>>;

// o último dígito do ano, quadro a quadro, em cada direção
const DIGITS: Record<Version, string[]> = { v1: ["6", "5", "4", "3"], v2: ["3", "4", "5", "6"] };

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

type TimeTravelProps = {
  to: Version; // a época de destino
  ready: () => Promise<void>; // resolve quando o destino pode aparecer (a v1 carregada)
  reduced: boolean; // "menos movimento": só uma troca suave
  language: Language;
  onSwap: () => void; // troca a versão na tela, por trás da camada
  onDone: () => void;
};

// a volta no tempo (D18): a página escurece, <GAD year={2026} /> aparece grande e o ano rola
// até a outra época; por trás da camada a versão na tela troca, e a camada clareia
function TimeTravel({ to, ready, reduced, language, onSwap, onDone }: TimeTravelProps) {
  const veilRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLSpanElement>(null);
  const loadingRef = useRef<HTMLParagraphElement>(null);
  const text = TEXT[language];

  // os callbacks podem mudar a cada render; o roteiro usa sempre os mais novos
  const latest = useRef({ ready, onSwap, onDone });
  useEffect(() => {
    latest.current = { ready, onSwap, onDone };
  });

  useEffect(() => {
    const veil = veilRef.current!, loading = loadingRef.current!;
    let cancelled = false;
    const running: Animation[] = [];
    const animate = (element: Element, frames: Keyframe[], duration: number, delay = 0) => {
      const animation = element.animate(frames, { duration: ms(duration), delay: ms(delay), easing: EASE, fill: "forwards" });
      running.push(animation);
      return animation.finished.then(() => undefined, () => undefined);
    };

    // espera o destino; se demorar, avisa que a v1 está carregando
    const waitReady = async () => {
      let done = false;
      const readyPromise = latest.current.ready().then(() => {
        done = true;
      });
      await sleep(0);
      if (!done && !cancelled) animate(loading, [{ opacity: 0 }, { opacity: 1 }], 200);
      await readyPromise;
      if (!cancelled) animate(loading, [{ opacity: 1 }, { opacity: 0 }], 150);
    };

    const run = async () => {
      if (reduced) {
        // menos movimento: escurece, troca e clareia, sem contador
        await animate(veil, [{ opacity: 0 }, { opacity: 1 }], 150);
        await waitReady();
        if (cancelled) return;
        latest.current.onSwap();
        await animate(veil, [{ opacity: 1 }, { opacity: 0 }], 150);
        if (!cancelled) latest.current.onDone();
        return;
      }

      // com movimento, o contador existe; as formas longas diminuem até caber na largura da tela
      const counter = counterRef.current!, tag = tagRef.current!, strip = stripRef.current!;
      tag.style.fontSize = "100px";
      tag.style.fontSize = `${Math.max(28, Math.min(132, (100 * window.innerWidth * 0.88) / tag.scrollWidth)).toFixed(1)}px`;

      animate(veil, [{ opacity: 0 }, { opacity: 0.86 }], 220);
      await animate(counter, [{ opacity: 0, transform: "translateY(4%)" }, { opacity: 1, transform: "none" }], 260);
      for (let step = 1; step < 4 && !cancelled; step++) {
        await animate(strip, [{ transform: `translateY(-${step - 1}em)` }, { transform: `translateY(-${step}em)` }], 190);
        await sleep(ms(60));
      }
      if (cancelled) return;
      await waitReady();
      if (cancelled) return;
      await sleep(ms(200));
      // a camada fecha de vez, a época troca por trás dela, e ela clareia
      animate(counter, [{ opacity: 1 }, { opacity: 0 }], 260);
      await animate(veil, [{ opacity: 0.86 }, { opacity: 1 }], 120);
      if (cancelled) return;
      latest.current.onSwap();
      await animate(veil, [{ opacity: 1 }, { opacity: 0 }], 380, 40);
      if (!cancelled) latest.current.onDone();
    };
    run();

    return () => {
      cancelled = true;
      running.forEach((animation) => animation.cancel());
    };
  }, [reduced]);

  // só decoração: quem usa leitor de tela ouve o título do iframe da v1, que recebe o foco
  return (
    <div className={styles.travel} aria-hidden="true">
      <div ref={veilRef} className={styles.veil} />
      {/* com "menos movimento", nem o contador é montado */}
      {!reduced && (
        <div ref={counterRef} className={styles.counter}>
          <div ref={tagRef} className={styles.tag}>
            <span className={styles.bracket}>&lt;</span>
            GAD <span className={styles.attribute}>year</span>
            <span className={styles.bracket}>={"{"}</span>
            <span className={styles.value}>
              202
              <span className={styles.roll}>
                <span ref={stripRef} className={styles.strip}>
                  {DIGITS[to].map((digit, i) => (
                    <span key={i}>{digit}</span>
                  ))}
                </span>
              </span>
            </span>
            <span className={styles.bracket}>{"}"} /&gt;</span>
          </div>
          <p className={styles.caption}>{text[to]}</p>
        </div>
      )}
      <p ref={loadingRef} className={styles.loading}>
        {text.loading}
      </p>
    </div>
  );
}

export default TimeTravel;
