import { useLanguage } from "../../context/language";
import styles from "./sections.module.css";

// a estrutura das Hard skills do LinkedIn (Fase 3), mais o que os projetos mostram
// (MongoDB, Cypress, Pytest e Playwright). O Claude tem um grupo só dele; os chips são todos
// iguais, porque um chip destacado parecia um item selecionado
const GROUPS = [
  { label: { portuguese: "frontEnd", english: "frontEnd" }, items: ["React", "TypeScript", "JavaScript", "Redux", "HTML", "CSS"] },
  {
    label: { portuguese: "backEnd", english: "backEnd" },
    items: ["Node.js", "Express", "Python", "Django", "Flask", "Sequelize", "JWT"],
  },
  { label: { portuguese: "dados", english: "data" }, items: ["MariaDB", "MySQL", "MongoDB"] },
  {
    label: { portuguese: "testes", english: "tests" },
    items: ["Jest", "RTL", "Mocha", "Chai", "Cypress", "Pytest", "Playwright"],
  },
  { label: { portuguese: "devOps", english: "devOps" }, items: ["Docker", "Git", "GitHub", "CI/CD", "Linux", "Bash"] },
  {
    label: { portuguese: "práticas", english: "practices" },
    items: ["APIs RESTful", "POO", "SOLID", "Web Scraping"],
  },
  { label: { portuguese: "ia", english: "ai" }, items: ["Claude"] },
];

// os nomes de tecnologia são iguais nos dois idiomas; só os conceitos mudam
const ENGLISH: Record<string, string> = { POO: "OOP" };

function Stacks() {
  const { language } = useLanguage();
  return (
    <dl className={styles.stackGroups}>
      {GROUPS.map(({ label, items }) => (
        <div key={label.english}>
          <dt>{label[language]}</dt>
          <dd>
            {items.map((item) => (
              <span key={item} className={styles.chip}>
                {language === "english" ? (ENGLISH[item] ?? item) : item}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default Stacks;
