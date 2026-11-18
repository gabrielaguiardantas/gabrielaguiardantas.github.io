import type { ComponentType } from "react";
import { useLanguage } from "../../context/language";
import { ms, useTyping } from "../../motion";
import { SECTIONS, type SectionId } from "../../sections";
import About from "./about";
import Stacks from "./stacks";
import Projects from "./projects";
import Versions from "./versions";
import Contact from "./contact";
import styles from "./sections.module.css";

const CONTENT: Record<SectionId, ComponentType> = {
  about: About,
  stacks: Stacks,
  projects: Projects,
  versions: Versions,
  contact: Contact,
};

// efeito 2 (D14): enquanto o <GAD /> vai para o canto, o título da seção é "digitado"
// a 45 ms por letra. O leitor de tela recebe o título inteiro de uma vez
function SectionTitle({ label }: { label: string }) {
  const { typed } = useTyping(label, { interval: ms(45), delay: ms(320) });
  return (
    <h2 className={styles.title}>
      <span aria-hidden="true">
        <span className={styles.bracket}>&lt;</span>
        {typed}
        <span className={styles.bracket}> /&gt;</span>
      </span>
      <span className={styles.srOnly}>{label}</span>
    </h2>
  );
}

function Section({ section }: { section: SectionId }) {
  const { language } = useLanguage();
  const label = SECTIONS.find(({ id }) => id === section)!.label[language];
  const Content = CONTENT[section];
  return (
    <article className={styles.section} data-section={section}>
      <SectionTitle label={label} />
      <Content />
    </article>
  );
}

export default Section;
