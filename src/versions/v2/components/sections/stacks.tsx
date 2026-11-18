import { useLanguage } from "../../context/language";
import styles from "./sections.module.css";

// grupos do protótipo, provisórios até a Fase 3. O Claude ganha destaque (D5)
const GROUPS = [
  { label: { portuguese: "frontEnd", english: "frontEnd" }, items: ["React", "TypeScript", "JavaScript", "Redux", "HTML", "CSS"] },
  {
    label: { portuguese: "backEnd", english: "backEnd" },
    items: ["Node.js", "Express", "Sequelize", "Python", "Django", "Flask", "JWT"],
  },
  { label: { portuguese: "dados", english: "data" }, items: ["MariaDB", "MySQL", "MongoDB"] },
  {
    label: { portuguese: "testes", english: "tests" },
    items: ["Jest", "RTL", "Mocha", "Chai", "Cypress", "Pytest", "Playwright"],
  },
  { label: { portuguese: "ferramentas", english: "tools" }, items: ["Claude", "Docker", "Git", "Linux", "VS Code"] },
];

const HIGHLIGHT = new Set(["Claude"]);

function Stacks() {
  const { language } = useLanguage();
  return (
    <dl className={styles.stackGroups}>
      {GROUPS.map(({ label, items }) => (
        <div key={label.english}>
          <dt>{label[language]}</dt>
          <dd>
            {items.map((item) => (
              <span key={item} className={HIGHLIGHT.has(item) ? `${styles.chip} ${styles.highlight}` : styles.chip}>
                {item}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default Stacks;
