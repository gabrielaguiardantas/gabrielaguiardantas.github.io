// o conteúdo do currículo, por idioma, na mesma base comum do LinkedIn, do GitHub e do site.
// **negrito** vira <strong>
export const CONTENT = {
  portuguese: {
    lang: "pt-BR",
    title: "Currículo - Gabriel Aguiar Dantas",
    file: "Curriculo_Gabriel_Aguiar_Dantas.pdf",
    name: "Gabriel Aguiar Dantas",
    headline: "Desenvolvedor Full Stack | JavaScript · TypeScript · React.js · Node.js · SQL",
    location: "Vila Velha, ES",
    phone: "(27) 98815-5106",
    sections: {
      summary: "Resumo profissional",
      skills: "Competências técnicas",
      experience: "Experiência profissional",
      education: "Formação acadêmica",
      courses: "Cursos e certificações",
      languages: "Idiomas",
    },
    summary:
      "Desenvolvedor Full Stack com quase 3 anos de experiência em insurtech, atuando no ciclo completo de desenvolvimento de uma plataforma web em **React.js, Node.js e MariaDB**, utilizada por três grandes seguradoras, em ambiente ágil e com regras de negócio críticas do setor de seguros. Experiência em manutenção e modernização de sistemas legados, entregas em time de funcionalidades centrais e automação de extração de dados e relatórios. Graduado em **Ciências Econômicas (UFES)** e cursando **Ciência da Computação (UVV)**, combino visão de negócio e análise de dados com fundamentos sólidos de engenharia de software.",
    skills: [
      ["Front-end", "React.js, TypeScript, JavaScript (ES6+), Redux, HTML5, CSS3"],
      ["Back-end", "Node.js, Express, Python (Django, Flask), Sequelize, APIs RESTful"],
      ["Banco de dados", "MariaDB, MySQL, MongoDB, SQL"],
      ["Testes", "Jest, React Testing Library (RTL), Mocha, Chai, Cypress, Playwright"],
      ["DevOps e ferramentas", "Docker, Git/GitHub, CI/CD, Linux/Bash, Web Scraping"],
      ["IA", "Claude (desenvolvimento AI-oriented)"],
      ["Práticas", "Programação Orientada a Objetos (POO), SOLID, metodologias ágeis"],
    ],
    jobs: [
      {
        role: "Desenvolvedor Full Stack Júnior",
        org: "Fitinsur",
        period: "jan/2024 – out/2026",
        detail: "Insurtech (startup do setor de seguros)",
        place: "São Paulo, SP (remoto)",
        bullets: [
          "Entreguei mais de 150 tickets, entre novas funcionalidades e correções de bugs.",
          "Sustentei e evoluí a plataforma legada da empresa (React.js, Node.js e MariaDB), garantindo a estabilidade de fluxos com regras de negócio críticas do setor segurador.",
          "Em conjunto com o time, participei da entrega de funcionalidades centrais, como o módulo de administração e a seção de grupo econômico nas análises de crédito, além de refatorações para melhorar a manutenibilidade do código.",
          "Construí consultas SQL em MariaDB e scripts automatizados em JavaScript/Node.js para extração, tratamento e geração de relatórios de dados operacionais.",
          "Nos últimos 4 meses, atuei exclusivamente com desenvolvimento assistido por IA, usando o Claude.",
          "Trabalhei em ambiente ágil, com entregas contínuas e versionamento via Git/GitHub.",
        ],
      },
      {
        role: "Agente de Pesquisa e Mapeamento",
        org: "IBGE",
        period: "mar/2017 – mar/2020",
        detail: "Instituto Brasileiro de Geografia e Estatística",
        place: "Vila Velha, ES",
        bullets: [
          "Executei, supervisionei e conduzi treinamentos em pesquisas domiciliares e econômicas, presenciais e por telefone.",
          "Desenvolvi comunicação interpessoal, empatia e resolução de problemas em cenários dinâmicos.",
        ],
      },
    ],
    education: [
      ["**Bacharelado em Ciência da Computação** — UVV (em andamento)", "jul/2026 – jul/2030"],
      ["**Bacharelado em Ciências Econômicas** — UFES", "jan/2007 – dez/2012"],
    ],
    courses: [
      ["**Desenvolvimento Web Full Stack, com especialização em Python** — Trybe", "ago/2022 – set/2023"],
      ["**Inglês — curso completo** — Wizard", "jul/2007 – jul/2015"],
      ["**TOEIC** (Listening & Reading) — 690 pontos", "dez/2014"],
    ],
    languages: [
      ["Português", "nativo"],
      ["Inglês", "intermediário"],
    ],
  },
  english: {
    lang: "en",
    title: "Resume - Gabriel Aguiar Dantas",
    file: "Resume_Gabriel_Aguiar_Dantas.pdf",
    name: "Gabriel Aguiar Dantas",
    headline: "Full Stack Developer | JavaScript · TypeScript · React.js · Node.js · SQL",
    location: "Vila Velha, ES, Brazil",
    phone: "+55 27 98815-5106",
    sections: {
      summary: "Professional summary",
      skills: "Technical skills",
      experience: "Professional experience",
      education: "Education",
      courses: "Courses and certifications",
      languages: "Languages",
    },
    summary:
      "Full Stack Developer with almost 3 years of experience at an insurtech, working across the full development cycle of a web platform built with **React.js, Node.js and MariaDB**, used by three major insurers, in an agile environment with critical insurance business rules. Experienced in maintaining and modernizing legacy systems, delivering core features as part of a team, and automating data extraction and reports. I hold a degree in **Economics (UFES)** and I'm studying **Computer Science (UVV)**, combining business insight and data analysis with solid software engineering fundamentals.",
    skills: [
      ["Front-end", "React.js, TypeScript, JavaScript (ES6+), Redux, HTML5, CSS3"],
      ["Back-end", "Node.js, Express, Python (Django, Flask), Sequelize, RESTful APIs"],
      ["Databases", "MariaDB, MySQL, MongoDB, SQL"],
      ["Testing", "Jest, React Testing Library (RTL), Mocha, Chai, Cypress, Playwright"],
      ["DevOps and tools", "Docker, Git/GitHub, CI/CD, Linux/Bash, Web Scraping"],
      ["AI", "Claude (AI-oriented development)"],
      ["Practices", "Object-Oriented Programming (OOP), SOLID, agile methodologies"],
    ],
    jobs: [
      {
        role: "Junior Full Stack Developer",
        org: "Fitinsur",
        period: "Jan 2024 – Oct 2026",
        detail: "Insurtech (insurance startup)",
        place: "São Paulo, Brazil (remote)",
        bullets: [
          "Delivered 150+ tickets, including new features and bug fixes.",
          "Maintained and evolved the company's legacy platform (React.js, Node.js and MariaDB), ensuring the stability of flows with critical insurance business rules.",
          "Worked with the team to deliver core features, such as the admin module and the corporate group section in credit analyses, along with refactorings to improve code maintainability.",
          "Built SQL queries in MariaDB and automated JavaScript/Node.js scripts to extract, process and report operational data.",
          "In my last 4 months, worked exclusively on AI-assisted development with Claude.",
          "Worked in an agile environment, with continuous delivery and version control via Git/GitHub.",
        ],
      },
      {
        role: "Research and Mapping Agent",
        org: "IBGE",
        period: "Mar 2017 – Mar 2020",
        detail: "Brazilian Institute of Geography and Statistics",
        place: "Vila Velha, Brazil",
        bullets: [
          "Carried out and supervised household and economic surveys, in person and by phone, and led training sessions.",
          "Developed interpersonal communication, empathy and problem-solving skills in dynamic settings.",
        ],
      },
    ],
    education: [
      ["**Bachelor's in Computer Science** — UVV (in progress)", "Jul 2026 – Jul 2030"],
      ["**Bachelor's in Economics** — UFES", "Jan 2007 – Dec 2012"],
    ],
    courses: [
      ["**Full Stack Web Development, with a specialization in Python** — Trybe", "Aug 2022 – Sep 2023"],
      ["**English — complete course** — Wizard", "Jul 2007 – Jul 2015"],
      ["**TOEIC** (Listening & Reading) — 690 points", "Dec 2014"],
    ],
    languages: [
      ["Portuguese", "native"],
      ["English", "intermediate"],
    ],
  },
};

// os mesmos nos dois idiomas
export const CONTACT = {
  email: "gabrielaguiardantas@gmail.com",
  links: [
    "https://www.linkedin.com/in/gabrielaguiardantas",
    "https://github.com/gabrielaguiardantas",
    "https://gabrielaguiardantas.github.io",
  ],
};
