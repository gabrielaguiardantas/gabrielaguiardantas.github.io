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
            Em 2021 ao saber da gravidez da minha então
            {<a className="love"> namorada (hoje esposa)</a>}, decidi correr
            atrás de uma mudança de área que tanto sonhei. Pesquisei várias
            escolas de tecnologia com o intuito de ter bons professores para me
            guiar na missão de me tornar um Desenvolvedor Web/Software. Na
            {<a href="https://www.betrybe.com"> Trybe</a>} recebi um suporte
            fenomenal com professores dedicados e com uma carga de estudos
            intensa (como eu queria). Com o apoio da
            {
              <a
                className="a_family_img"
                onMouseOver={() => setIsHovering(!isHovering)}
              >
                &nbsp;minha família&nbsp;
              </a>
            }
            consegui concluir o curso (Setembro de 2023) e agora estou em busca
            de uma oportunidade na área. <br /> Tenho como background uma formação em
            Ciências Econômicas pela
            {
              <a href="https://www.ufes.br">
                &nbsp;Universidade Federal do Espírito Santo (UFES)&nbsp;
              </a>
            }
            cujos estudos refinaram meu gosto pela lógica e problemas complexos
            (construindo uma sólida base para as hard skills). Também fui
            concursado temporário do
            {
              <a href="https://www.ibge.gov.br">
                &nbsp;Instituto Brasileiro de Geografia e Estatística
                (IBGE)&nbsp;
              </a>
            }
            como Agente de pesquisa e mapeamento, onde desenvolvi minhas
            habilidades de comunicação e trabalho em equipe (tão famosas hoje em
            dia como soft skills).
          </p>
        </>
      ) : (
        <>
          <h1>About</h1>
          <p>
            In 2022, upon knowing of my
            {<a className="love"> then-girlfriend (now wife)'s</a>} pregnancy, I
            decided to pursue a career change that I had always dreamed of. I
            researched several technology schools in order to have good teachers
            to guide me in becoming a Web/Software Developer. At
            {<a href="https://www.betrybe.com"> Trybe</a>}, I received
            phenomenal support from dedicated teachers and an intense study load
            (just as I wanted). With the support of
            {
              <a
                className="a_family_img"
                onMouseOver={() => setIsHovering(!isHovering)}
              >
                &nbsp;my family
              </a>
            }
            , I was able to complete the course and am now seeking an
            opportunity in this job field. My background includes a degree in
            Economics from the
            {
              <a href="https://www.ufes.br">
                &nbsp;Federal University of Espírito Santo (UFES)
              </a>
            }
            , whose studies refined my taste for logic and complex problems
            (building a solid foundation for hard skills). I was also a
            temporary government employee of the
            {
              <a href="https://www.ibge.gov.br">
                &nbsp;Brazilian Institute of Geography and Statistics
                (IBGE)&nbsp;
              </a>
            }
            as a Research and Mapping Agent, where I developed my communication
            and teamwork skills (now so famous as soft skills).
          </p>
        </>
      )}
    </section>
  );
}

export default About;
