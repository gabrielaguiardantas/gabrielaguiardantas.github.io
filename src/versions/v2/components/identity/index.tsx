import type { CSSProperties, ReactNode } from "react";
import brazil from "../../assets/brazil.svg";
import uk from "../../assets/uk.svg";
import github from "../../assets/github.svg";
import linkedin from "../../assets/linkedin.svg";
import email from "../../assets/email.svg";
import resume from "../../assets/resume.svg";
import { type Language, useLanguage } from "../../context/language";
import styles from "./identity.module.css";

// ferramentas citadas no footer, cada uma com o link oficial
const TOOLS = {
  claude: { name: "Claude", href: "https://claude.com/" },
  typescript: { name: "TypeScript", href: "https://www.typescriptlang.org/" },
  vscode: { name: "Visual Studio Code", href: "https://code.visualstudio.com/" },
  react: { name: "React", href: "https://react.dev/" },
  vite: { name: "Vite", href: "https://vite.dev/" },
};

type ToolLink = (tool: keyof typeof TOOLS) => ReactNode;

const toolLink: ToolLink = (tool) => (
  <a href={TOOLS[tool].href} target="_blank" rel="noopener noreferrer">
    {TOOLS[tool].name}
  </a>
);

const TEXT = {
  portuguese: {
    role: "Desenvolvedor Full Stack",
    languages: "Idioma",
    tagline: "Desenvolvo produtos web responsivos e multi‑dispositivos", // U+2011: o hífen não quebra a linha
    email: "E-mail",
    resume: "Currículo em PDF",
    // gerado por npm run resume, a partir de resume/content.mjs
    resumeFile: "/Curriculo_Gabriel_Aguiar_Dantas.pdf",
    footer: (tool: ToolLink) => (
      <>
        Desenvolvido por mim, de forma AI-oriented em parceria com o {tool("claude")}, em {tool("typescript")} no{" "}
        {tool("vscode")}, tendo como base {tool("react")} e {tool("vite")}. © 2026 Gabriel A. Dantas – Todos os
        direitos reservados. v2.0
      </>
    ),
  },
  english: {
    role: "Full Stack Developer",
    languages: "Language",
    tagline: "I build responsive, multi‑device web products",
    email: "Email",
    resume: "Resume (PDF)",
    resumeFile: "/Resume_Gabriel_Aguiar_Dantas.pdf",
    footer: (tool: ToolLink) => (
      <>
        Developed by me, AI-oriented, in partnership with {tool("claude")}, in {tool("typescript")} on{" "}
        {tool("vscode")}, built on {tool("react")} and {tool("vite")}. © 2026 Gabriel A. Dantas – All rights
        reserved. v2.0
      </>
    ),
  },
} satisfies Record<Language, Record<string, string | ((tool: ToolLink) => ReactNode)>>;

// cada bandeira tem o nome do idioma no próprio idioma
const LANGUAGES: { id: Language; flag: string; label: string }[] = [
  { id: "portuguese", flag: brazil, label: "Português" },
  { id: "english", flag: uk, label: "English" },
];

// data-orbit-avoid marca o que a órbita não pode cobrir (ver components/stage):
// "ink" mede só o texto, "box" mede a caixa inteira

// os ícones são máscaras pintadas com background-color, então seguem os tokens de cor
const icon = (src: string) => ({ "--icon": `url("${src}")` }) as CSSProperties;

// children: o guia <p>, que ocupa o vão entre o topo e o footer (D14)
function Identity({ children }: { children?: ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const text = TEXT[language];

  const socials = [
    { label: "GitHub", icon: github, href: "https://github.com/gabrielaguiardantas", external: true },
    { label: "LinkedIn", icon: linkedin, href: "https://www.linkedin.com/in/gabrielaguiardantas", external: true },
    { label: text.email, icon: email, href: "#contact", external: false },
    // o PDF do idioma ativo, numa aba nova
    { label: text.resume, icon: resume, href: text.resumeFile, external: true },
  ];

  return (
    <aside className={styles.identity}>
      <header className={styles.header}>
        <h1 className={styles.name} data-orbit-avoid="ink">Gabriel Aguiar Dantas</h1>
        <p className={styles.role} data-orbit-avoid="ink">{text.role}</p>
        <div className={styles.flags} role="group" aria-label={text.languages}>
          {LANGUAGES.map(({ id, flag, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={language === id}
              aria-label={label}
              title={label}
              onClick={() => setLanguage(id)}
              data-orbit-avoid="box"
            >
              {/* a bandeira é decorativa: o nome fica no botão, e o NVDA não diz mais "gráfico" */}
              <img src={flag} alt="" />
            </button>
          ))}
        </div>
        <p className={styles.tagline} data-orbit-avoid="ink">{text.tagline}</p>
        <ul className={styles.socials}>
          {socials.map(({ label, icon: src, href, external }) => (
            <li key={href}>
              <a
                href={href}
                aria-label={label}
                title={label}
                data-orbit-avoid="box"
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                <span style={icon(src)} />
              </a>
            </li>
          ))}
        </ul>
      </header>
      {children}
      <footer className={styles.footer}>
        <p data-orbit-avoid="ink">{text.footer(toolLink)}</p>
      </footer>
    </aside>
  );
}

export default Identity;
