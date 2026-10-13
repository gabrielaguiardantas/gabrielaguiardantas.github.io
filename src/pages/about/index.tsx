import { useSelector } from "react-redux";
import { RootState } from "../../types";
import "./about.css";
import PopUp from "../../components/popup";
import { useState } from "react";

function About() {
  const language_page = useSelector((state: RootState) => state.language);
  const [isHovering, setIsHovering] = useState(false);

  const changingHovering = () => {
   setIsHovering(!isHovering);
  };
  return (
    <section className="about" id="about" role="about">
      {isHovering && <PopUp props={changingHovering}/>}
      {language_page === "portuguese" ? (
        <>
          <h1>Sobre</h1>
          <p>
            Em 2021, ao saber da gravidez da minha então
            {<a className="love"> namorada (hoje esposa)</a>}, decidi tomar a
            decisão que transformaria minha trajetória: correr atrás da paixão
            por tecnologia e computadores que me acompanha desde a infância.
            Busquei uma formação imersiva para me guiar nessa missão e, na
            {
              <a
                href="https://www.betrybe.com"
                target="_blank"
                rel="noreferrer"
              >
                &nbsp;Trybe
              </a>
            }
            , encontrei um ambiente de estudos intenso com professores dedicados.
            Com o apoio incondicional da
            {
              <a
                className="a_family_img"
                onMouseOver={() => setIsHovering(!isHovering)}
              >
                &nbsp;minha família&nbsp;
              </a>
            }
            , concluí a formação em Desenvolvimento Web Full Stack em setembro
            de 2023.
          </p>
          <p>
            No mercado de tecnologia, atuei como{" "}
            <strong>Desenvolvedor Full Stack</strong> em uma startup voltada para
            o setor segurador (<strong>Insurtech</strong>). Estive à frente da
            sustentação e evolução de um sistema legado em produção, operando em
            uma arquitetura composta por backend em <strong>Node.js</strong>,
            frontend em <strong>React</strong> e banco de dados{" "}
            <strong>MariaDB</strong>. Minhas entregas iam desde a investigação e
            resolução ágil de bugs pontuais e refatorações de código até a
            arquitetura e entrega de novos módulos completos de ponta a ponta,
            navegando pelas regras de negócio críticas e fluxos complexos do ramo
            segurador. Além disso, atuei intensamente com dados, elaborando
            queries em SQL e desenvolvendo scripts automatizados em
            JavaScript/Node.js para extração, tratamento e geração de relatórios
            operacionais.
          </p>
          <p>
            Para aprofundar ainda mais meus fundamentos em engenharia de
            software, ingressei na graduação em Ciência da Computação pela
            {
              <a href="https://www.uvv.br" target="_blank" rel="noreferrer">
                &nbsp;Universidade Vila Velha (UVV)&nbsp;
              </a>
            }
            , consolidando conceitos de algoritmos, estruturas de dados e
            arquitetura de computadores. Essa base técnica se conecta
            diretamente à minha primeira graduação em Ciências Econômicas pela
            {
              <a href="https://www.ufes.br" target="_blank" rel="noreferrer">
                &nbsp;Universidade Federal do Espírito Santo (UFES)&nbsp;
              </a>
            }
            , cujos estudos refinaram meu raciocínio analítico, lógica e a
            facilidade para enxergar o valor de negócio por trás de cada linha
            de código.
          </p>
          <p>
            Complementando essa bagagem, minha experiência como concursado
            temporário do
            {
              <a
                href="https://www.ibge.gov.br"
                target="_blank"
                rel="noreferrer"
              >
                &nbsp;Instituto Brasileiro de Geografia e Estatística (IBGE)&nbsp;
              </a>
            }
            como Agente de Pesquisa e Mapeamento me colocou em contato direto
            com as mais diversas famílias e realidades sociais. Seja aplicando
            pesquisas domiciliares, seja auxiliando outros agentes em
            treinamento e supervisão, desenvolvi comunicação clara, empatia,
            escuta ativa e trabalho em equipe — competências essenciais para
            colaborar e construir soluções eficientes em qualquer equipe de
            tecnologia.
          </p>
        </>
      ) : (
        <>
          <h1>About</h1>
          <p>
            In 2021, upon learning of my
            {<a className="love"> then-girlfriend (now wife)'s</a>} pregnancy, I
            decided to take a definitive leap: pursue the career transition in
            technology and computing that I had dreamed of since childhood.
            Seeking rigorous mentorship, I enrolled at
            {
              <a
                href="https://www.betrybe.com"
                target="_blank"
                rel="noreferrer"
              >
                &nbsp;Trybe
              </a>
            }
            , where I immersed myself in an intense and demanding study routine.
            With the unconditional support of
            {
              <a
                className="a_family_img"
                onMouseOver={() => setIsHovering(!isHovering)}
              >
                &nbsp;my family&nbsp;
              </a>
            }
            , I completed my Full Stack Web Development training in September
            2023.
          </p>
          <p>
            In the tech industry, I worked as a{" "}
            <strong>Full Stack Developer</strong> at a startup serving the
            insurance sector (<strong>Insurtech</strong>). I worked directly on
            the lifecycle and scaling of a production legacy system built with a{" "}
            <strong>Node.js backend</strong>, a <strong>React frontend</strong>,
            and a <strong>MariaDB</strong> database. My responsibilities ranged
            from rapid bug troubleshooting and refactoring to the architectural
            design and release of entire end-to-end modules, addressing complex
            business logic and strict industry requirements. Additionally, I
            worked heavily with operational data, writing SQL queries and
            building automated JavaScript/Node.js scripts for data extraction,
            transformation, and reporting.
          </p>
          <p>
            To continue deepening my theoretical foundation in software
            engineering, I am currently pursuing a degree in Computer Science at
            {
              <a href="https://www.uvv.br" target="_blank" rel="noreferrer">
                &nbsp;Universidade Vila Velha (UVV)&nbsp;
              </a>
            }
            , focusing on algorithms, data structures, and computer
            architecture. This technical core connects seamlessly with my
            Bachelor's degree in Economics from the
            {
              <a href="https://www.ufes.br" target="_blank" rel="noreferrer">
                &nbsp;Federal University of Espírito Santo (UFES)&nbsp;
              </a>
            }
            , which honed my analytical thinking, logic, and ability to align
            code architecture with business value.
          </p>
          <p>
            Rounding out my background, my prior experience as a temporary
            public agent at the
            {
              <a
                href="https://www.ibge.gov.br"
                target="_blank"
                rel="noreferrer"
              >
                &nbsp;Brazilian Institute of Geography and Statistics (IBGE)&nbsp;
              </a>
            }
            immersed me in direct fieldwork across diverse socioeconomic
            environments. Conducting household surveys and mentoring colleagues
            through onboarding and supervision honed my communication, empathy,
            active listening, and teamwork — vital skills for building
            collaborative and high-performing engineering teams.
          </p>
        </>
      )}
    </section>
  );
}

export default About;
