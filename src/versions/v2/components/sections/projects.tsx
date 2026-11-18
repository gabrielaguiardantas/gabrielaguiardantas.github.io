import { useLanguage } from "../../context/language";
import styles from "./sections.module.css";

// os mesmos 6 projetos fixados no GitHub, com as descrições e as stacks do README do perfil (Fase 3)
const PROJECTS = [
  {
    year: "2023–26",
    name: { portuguese: "Portfólio", english: "Portfolio" },
    description: {
      portuguese:
        "Este site: a v2 atual e a v1 de 2023 preservada, com troca entre versões em runtime, testes E2E e deploy automatizado.",
      english:
        "This site: the current v2 and the preserved 2023 v1, with runtime switching between versions, E2E tests and automated deployment.",
    },
    stacks: ["TypeScript", "React", "Vite", "Playwright", "GitHub Actions"],
    repo: "gabrielaguiardantas.github.io",
  },
  {
    year: "2023",
    name: { portuguese: "Trybe Futebol Clube", english: "Trybe Futebol Clube" },
    description: {
      portuguese:
        "API REST de partidas e classificação de um campeonato de futebol, com autenticação JWT e testes de integração.",
      english: "REST API for the matches and standings of a football championship, with JWT authentication and integration tests.",
    },
    stacks: ["TypeScript", "Node.js", "Express", "Sequelize", "MySQL", "Mocha", "Chai", "Sinon"],
    repo: "project-trybe-futebol-clube",
  },
  {
    year: "2023",
    name: { portuguese: "Blogs API", english: "Blogs API" },
    description: {
      portuguese: "API REST para publicação de posts em blog, com autenticação JWT.",
      english: "REST API for publishing blog posts, with JWT authentication.",
    },
    stacks: ["Node.js", "Express", "Sequelize", "MySQL"],
    repo: "project-blogs-api",
  },
  {
    year: "2023",
    name: { portuguese: "Trybesmith", english: "Trybesmith" },
    description: {
      portuguese: "API REST de uma ferraria de RPG, com cadastro de produtos, autenticação JWT e arquitetura MSC.",
      english: "REST API for an RPG blacksmith shop, with product registration, JWT authentication and MSC architecture.",
    },
    stacks: ["TypeScript", "Node.js", "Express", "MySQL", "Docker"],
    repo: "project-trybesmith",
  },
  {
    year: "2023",
    name: { portuguese: "Recipes App", english: "Recipes App" },
    description: {
      portuguese: "Aplicação front-end de receitas desenvolvida em grupo, com testes de componentes.",
      english: "Recipe front-end app built as a team, with component tests.",
    },
    stacks: ["React", "React Router", "RTL"],
    repo: "project-recipes-app",
  },
  {
    year: "2023",
    name: { portuguese: "Super Portfólio", english: "Super Portfolio" },
    description: {
      portuguese:
        "Projeto final da especialização em Python da Trybe: CRUD de portfólios com autenticação JWT, em que cada usuário edita apenas os dados que criou.",
      english:
        "Final project of Trybe's Python specialization: a portfolio CRUD with JWT authentication, where each user edits only the data they created.",
    },
    stacks: ["Python", "Django", "Django REST Framework", "MySQL"],
    repo: "project-super-portfolio",
  },
];

const NOTE = {
  portuguese:
    "O código do meu trabalho na Fitinsur é privado da empresa. Por isso, os projetos abaixo, com exceção do portfólio, vêm da minha formação na Trybe, numa seleção dos mais relevantes. Os demais estão no link ao fim da lista.",
  english:
    "The code from my work at Fitinsur is private to the company, so the projects below, except for this portfolio, come from my training at Trybe, as a selection of the most relevant ones. The others are in the link at the end of the list.",
};

// a lista completa, para quem quiser ver além da seleção
const ALL_REPOSITORIES = {
  href: "https://github.com/gabrielaguiardantas?tab=repositories",
  label: { portuguese: "// todos os repositórios no GitHub ↗", english: "// all repositories on GitHub ↗" },
};

const REPO_LABEL = {
  portuguese: (name: string) => `Código de ${name} no GitHub`,
  english: (name: string) => `${name} source code on GitHub`,
};

function Projects() {
  const { language } = useLanguage();
  return (
    <>
      <p className={styles.note}>{NOTE[language]}</p>
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
      <a className={styles.allRepositories} href={ALL_REPOSITORIES.href} target="_blank" rel="noopener noreferrer">
        {ALL_REPOSITORIES.label[language]}
      </a>
    </>
  );
}

export default Projects;
