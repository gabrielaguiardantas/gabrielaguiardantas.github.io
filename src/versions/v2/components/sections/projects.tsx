import { useLanguage } from "../../context/language";
import styles from "./sections.module.css";

// seleção do protótipo, provisória até a Fase 3
const PROJECTS = [
  {
    year: "2023–26",
    name: { portuguese: "Portfólio", english: "Portfolio" },
    description: {
      portuguese: "Este site: v1 de 2023 preservada e v2 em evolução, com troca entre versões em runtime.",
      english: "This site: the 2023 v1 preserved and v2 evolving, with runtime switching between versions.",
    },
    stacks: ["TypeScript", "React", "Vite", "Playwright"],
    repo: "gabrielaguiardantas.github.io",
  },
  {
    year: "2023",
    name: { portuguese: "Trybe Futebol Clube", english: "Trybe Futebol Clube" },
    description: {
      portuguese: "API back-end em TypeScript para dados de futebol.",
      english: "TypeScript back-end API for football data.",
    },
    stacks: ["TypeScript", "Docker"],
    repo: "project-trybe-futebol-clube",
  },
  {
    year: "2023",
    name: { portuguese: "Blogs API", english: "Blogs API" },
    description: {
      portuguese: "API para criação de conteúdo em blogs, com banco MySQL.",
      english: "API for creating blog content, with a MySQL database.",
    },
    stacks: ["Node.js", "Sequelize", "MySQL", "Docker"],
    repo: "project-blogs-api",
  },
  {
    year: "2023",
    name: { portuguese: "Trybesmith", english: "Trybesmith" },
    description: {
      portuguese: "Cadastro de produtos com autenticação JWT e banco MySQL.",
      english: "Product registry with JWT authentication and a MySQL database.",
    },
    stacks: ["TypeScript", "Node.js", "JWT", "MySQL"],
    repo: "project-trybesmith",
  },
  {
    year: "2023",
    name: { portuguese: "Recipes App", english: "Recipes App" },
    description: {
      portuguese: "Front-end em React para gerenciar e acompanhar receitas.",
      english: "React front-end to manage and follow recipes.",
    },
    stacks: ["React", "RTL", "JavaScript"],
    repo: "project-recipes-app",
  },
  {
    year: "2023",
    name: { portuguese: "Super Portfolio", english: "Super Portfolio" },
    description: {
      portuguese: "Aplicação Django para gerenciar portfólios.",
      english: "Django application to manage portfolios.",
    },
    stacks: ["Python", "Django", "JWT", "MySQL"],
    repo: "project-super-portfolio",
  },
];

const REPO_LABEL = {
  portuguese: (name: string) => `Código de ${name} no GitHub`,
  english: (name: string) => `${name} source code on GitHub`,
};

function Projects() {
  const { language } = useLanguage();
  return (
    <ul className={styles.projects}>
      {PROJECTS.map(({ year, name, description, stacks, repo }) => (
        <li key={repo}>
          <span className={styles.year}>{year}</span>
          <h3>{name[language]}</h3>
          <p>{description[language]}</p>
          <div className={styles.chips}>
            {stacks.map((stack) => (
              <span key={stack} className={styles.chip}>
                {stack}
              </span>
            ))}
          </div>
          <a
            href={`https://github.com/gabrielaguiardantas/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={REPO_LABEL[language](name[language])}
          >
            repo ↗
          </a>
        </li>
      ))}
    </ul>
  );
}

export default Projects;
