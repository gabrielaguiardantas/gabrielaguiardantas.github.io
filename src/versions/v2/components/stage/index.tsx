import { type CSSProperties, type ComponentType, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/language";
import { navigate, useRoute } from "../../context/route";
import { useVersion } from "../../context/version";
import { SECTIONS, type SectionId } from "../../sections";
import About from "../../pages/about";
import Stacks from "../../pages/stacks";
import Projects from "../../pages/projects";
import Versions from "../../pages/versions";
import Contact from "../../pages/contact";
import { type Box, type OrbitGeometry, computeOrbit } from "./orbitLayout";
import styles from "./stage.module.css";

const TEXT = {
  portuguese: {
    core: { idle: "Explorar as seções", orbit: "Fechar as seções", section: "Voltar às seções" },
    hint: "// clique para explorar",
  },
  english: {
    core: { idle: "Explore the sections", orbit: "Close the sections", section: "Back to the sections" },
    hint: "// click to explore",
  },
};

// provisório até o passo 3, que traz as seções no visual novo
const CONTENT: Record<SectionId, ComponentType> = {
  about: About,
  stacks: Stacks,
  projects: Projects,
  versions: Versions,
  contact: Contact,
};

// no celular a órbita vira uma árvore e não precisa de geometria
const narrow = window.matchMedia("(max-width: 820px)");

const vars = (values: Record<string, string | number>) => values as CSSProperties;

// onde há texto ou ícone de fato. A coluna de identidade marca o que a órbita não pode
// cobrir com data-orbit-avoid: "ink" mede só o texto, "box" mede a caixa inteira
function obstacles(origin: DOMRect): Box[] {
  return [...document.querySelectorAll<HTMLElement>("[data-orbit-avoid]")].map((element) => {
    let rect = element.getBoundingClientRect();
    if (element.dataset.orbitAvoid === "ink") {
      const range = document.createRange();
      range.selectNodeContents(element);
      rect = range.getBoundingClientRect();
    }
    return {
      left: rect.left - origin.left - 12,
      right: rect.right - origin.left + 12,
      top: rect.top - origin.top - 8,
      bottom: rect.bottom - origin.top + 8,
    };
  });
}

// o palco: o <GAD /> no centro da página, a órbita com as seções e o painel da seção aberta (D13)
function Stage() {
  const route = useRoute();
  const { language } = useLanguage();
  const { version } = useVersion();
  const text = TEXT[language];
  const state = route.view;

  const stageRef = useRef<HTMLElement>(null);
  const coreRef = useRef<HTMLButtonElement>(null);
  const satRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [geometry, setGeometry] = useState<OrbitGeometry | null>(null);
  const [hot, setHot] = useState<number | null>(null);

  // recalcula a órbita quando o palco muda de tamanho, a fonte carrega, o idioma muda
  // (as tags mudam de largura) ou o <GAD /> termina de voltar do canto
  useLayoutEffect(() => {
    if (state === "section") return;
    const stage = stageRef.current!;
    const core = coreRef.current!;
    const measure = () => {
      if (narrow.matches) return;
      const satellites = satRefs.current.map((sat) => ({ width: sat!.offsetWidth, height: sat!.offsetHeight }));
      setGeometry(
        computeOrbit({
          stage: { width: stage.clientWidth, height: stage.clientHeight },
          core: { width: core.offsetWidth, height: core.offsetHeight },
          satellites,
          obstacles: obstacles(stage.getBoundingClientRect()),
        }),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    document.fonts.addEventListener("loadingdone", measure);
    core.addEventListener("transitionend", measure);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
      core.removeEventListener("transitionend", measure);
    };
  }, [state, language]);

  // Esc volta um nível: da seção para a órbita, da órbita para o início
  useEffect(() => {
    if (version !== "v2") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (state === "section") navigate("explore");
      else if (state === "orbit") navigate("idle");
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [state, version]);

  // no celular a seção abre abaixo da árvore; a página rola até ela
  const openSection = route.view === "section" ? route.section : null;
  useEffect(() => {
    if (!openSection || !narrow.matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stageRef.current!.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [openSection]);

  const onCore = () => navigate(state === "orbit" ? "idle" : "explore");
  const Content = openSection && CONTENT[openSection];

  return (
    <main
      ref={stageRef}
      className={styles.stage}
      data-state={state}
      style={vars({ "--shift": `${geometry?.shift ?? 0}px` })}
    >
      <svg className={styles.links} aria-hidden="true">
        {geometry?.lines.map((line, i) => (
          <line
            key={SECTIONS[i].id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className={hot === i ? styles.hot : undefined}
            style={vars({ "--i": i, "--len": line.length.toFixed(1) })}
          />
        ))}
      </svg>

      <button
        ref={coreRef}
        className={styles.core}
        type="button"
        aria-expanded={state === "orbit"}
        aria-controls="orbit"
        aria-label={text.core[state]}
        onClick={onCore}
      >
        <span className={styles.tag} aria-hidden="true">
          <span className={styles.bracket}>&lt;</span>
          <span className={styles.initials}>GAD</span>
          <span className={styles.bracket}> /&gt;</span>
          <span className={styles.caret} />
        </span>
      </button>
      <p className={styles.hint}>{text.hint}</p>

      {/* fora da órbita, as seções ficam inertes: sem foco nem leitor de tela */}
      <ul id="orbit" className={styles.satellites} inert={state !== "orbit"}>
        {SECTIONS.map(({ id, label }, i) => {
          const position = geometry?.satellites[i];
          return (
            <li key={id}>
              <button
                ref={(element) => {
                  satRefs.current[i] = element;
                }}
                className={styles.satellite}
                type="button"
                aria-label={label[language]}
                style={vars({ "--i": i, "--x": `${position?.x ?? 0}px`, "--y": `${position?.y ?? 0}px` })}
                onClick={() => navigate(id)}
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot(null)}
                onFocus={() => setHot(i)}
                onBlur={() => setHot(null)}
              >
                <span className={styles.bracket}>&lt;</span>
                {label[language]}
                <span className={styles.bracket}> /&gt;</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.panel}>{Content && <Content />}</div>
    </main>
  );
}

export default Stage;
