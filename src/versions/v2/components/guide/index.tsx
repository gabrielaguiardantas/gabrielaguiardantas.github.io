import { useEffect, useState } from "react";
import { type Language, useLanguage } from "../../context/language";
import type { Route } from "../../context/route";
import { ms, useTyping } from "../../motion";
import type { SectionId } from "../../sections";
import styles from "./guide.module.css";

type GuideKey = "idle" | "orbit" | SectionId;

// textos revisados na Fase 3
const TEXT: Record<Language, Record<GuideKey, string>> = {
  portuguese: {
    idle: "Bem-vindo ao meu portfólio. Tudo aqui orbita o <GAD />: clique nele para explorar.",
    orbit: "Cinco seções, cada uma um componente. Aponte para uma delas para saber o que tem lá.",
    about:
      "Quem sou e como cheguei aqui: da Economia e do IBGE à programação, passando pela Trybe e por quase 3 anos numa Insurtech.",
    stacks: "As tecnologias com que trabalho, do front-end ao banco de dados, dos testes ao deploy.",
    projects: "Uma seleção do que já construí, das APIs às aplicações em React, com o link para o código de cada um.",
    versions: "Este site tem história: a v1, de 2023, continua no ar. Daqui dá para voltar no tempo e ver como ele começou.",
    contact: "Os canais para conversarmos sobre oportunidades, projetos ou código: LinkedIn, GitHub e e-mail.",
  },
  english: {
    idle: "Welcome to my portfolio. Everything here orbits <GAD />: click it to explore.",
    orbit: "Five sections, each one a component. Point at one to see what's inside.",
    about:
      "Who I am and how I got here: from Economics and IBGE to programming, through Trybe and almost 3 years at an Insurtech.",
    stacks: "The technologies I work with, from the front end to the database, from testing to deployment.",
    projects: "A selection of what I've built, from APIs to React apps, with a link to the code of each one.",
    versions: "This site has a history: v1, from 2023, is still online. From here you can go back in time and see how it started.",
    contact: "Where we can talk about opportunities, projects or code: LinkedIn, GitHub and email.",
  },
};

// U+2011: o hífen não quebra a linha, então "e-mail" não vira "e- / mail"
const noBreak = (text: string) => text.replaceAll("-", "‑");

type GuideProps = {
  route: Route;
  pointed: SectionId | null; // a seção sob o mouse ou o foco, na órbita
  hidden: boolean; // enquanto o <GAD /> é digitado
};

// o guia (D14): no vão da coluna de identidade, onde a v1 tinha a nav, um <p> digitado
// explica o início, a órbita, a seção apontada ou a seção aberta
function Guide({ route, pointed, hidden }: GuideProps) {
  const { language } = useLanguage();
  const base: GuideKey | null = hidden ? null : route.view === "section" ? route.section : route.view;
  const target = pointed ?? base;

  // apontar uma seção ou mudar de estado troca o texto na hora; tirar o mouse espera um
  // pouco, porque ele pode estar indo para outra seção, e o texto da órbita não pisca no meio
  const [shown, setShown] = useState(target);
  const [lastBase, setLastBase] = useState(base);
  let immediate = pointed !== null;
  if (base !== lastBase) {
    setLastBase(base);
    immediate = true;
  }
  if (immediate && shown !== target) setShown(target);

  useEffect(() => {
    if (shown === target) return;
    const timer = setTimeout(() => setShown(target), ms(180));
    return () => clearTimeout(timer);
  }, [shown, target]);

  const text = shown ? noBreak(TEXT[language][shown]) : "";
  const { typed, done } = useTyping(text, { interval: ms(16), step: 2 });
  const classes = [styles.guide, !shown && styles.hidden, done && styles.done].filter(Boolean).join(" ");

  // o leitor de tela recebe o texto inteiro, sem a digitação nem as tags decorativas
  return (
    <p className={classes} data-orbit-avoid="box">
      <span className={styles.tag} aria-hidden="true">
        <span className={styles.bracket}>&lt;</span>p<span className={styles.bracket}>&gt;</span>
      </span>
      <span className={styles.body} aria-hidden="true">
        {typed}
        <span className={styles.caret} />
      </span>
      <span className={`${styles.tag} ${styles.close}`} aria-hidden="true">
        <span className={styles.bracket}>&lt;/</span>p<span className={styles.bracket}>&gt;</span>
      </span>
      {/* o "<GAD />" do texto vira "GAD": o NVDA lia "menor GAD barra maior" */}
      <span className={styles.srOnly}>{text.replaceAll("<GAD />", "GAD")}</span>
    </p>
  );
}

export default Guide;
