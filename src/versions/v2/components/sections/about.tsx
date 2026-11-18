import { useLanguage } from "../../context/language";
import styles from "./sections.module.css";

// conteúdo do protótipo, provisório até a Fase 3
const TEXT = {
  portuguese: {
    paragraphs: [
      "Sou Desenvolvedor Full Stack com quase 3 anos de experiência em uma Insurtech, onde desenvolvi e sustentei uma plataforma de seguros em produção com Node.js, React e MariaDB.",
      "Sou graduado em Ciências Econômicas (UFES) e graduando em Ciência da Computação (UVV), uma combinação que une visão de negócio e fundamentos técnicos. Estou aberto a novas oportunidades como Desenvolvedor Full Stack.",
    ],
    journey: "// trajetória",
    timeline: [
      { period: "2007 – 2012", place: "UFES", role: "Ciências Econômicas" },
      { period: "03/2017 – 03/2020", place: "IBGE", role: "Agente de Pesquisa e Mapeamento" },
      { period: "08/2022 – 09/2023", place: "Trybe", role: "Desenvolvimento Web Full Stack" },
      { period: "01/2024 – 10/2026", place: "Fitinsur", role: "Desenvolvedor Full Stack Júnior" },
      { period: "07/2026 – hoje", place: "UVV", role: "Ciência da Computação" },
    ],
  },
  english: {
    paragraphs: [
      "I'm a Full Stack Developer with almost 3 years of experience at an Insurtech, where I built and maintained an insurance platform in production with Node.js, React and MariaDB.",
      "I hold a degree in Economics (UFES) and I'm studying Computer Science (UVV), a combination of business insight and technical foundations. I'm open to new opportunities as a Full Stack Developer.",
    ],
    journey: "// journey",
    timeline: [
      { period: "2007 – 2012", place: "UFES", role: "Economics" },
      { period: "03/2017 – 03/2020", place: "IBGE", role: "Research and Mapping Agent" },
      { period: "08/2022 – 09/2023", place: "Trybe", role: "Full Stack Web Development" },
      { period: "01/2024 – 10/2026", place: "Fitinsur", role: "Junior Full Stack Developer" },
      { period: "07/2026 – present", place: "UVV", role: "Computer Science" },
    ],
  },
};

function About() {
  const text = TEXT[useLanguage().language];
  return (
    <>
      {text.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p className={styles.eyebrow}>{text.journey}</p>
      <ol className={styles.timeline}>
        {text.timeline.map(({ period, place, role }) => (
          <li key={place}>
            <time>{period}</time>
            <span>
              <strong>{place}</strong> · {role}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

export default About;
