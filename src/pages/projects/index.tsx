import { useSelector } from "react-redux";
import { RootState } from "../../types";
import { githubPages } from "../stacks/centralIconsFile";
import "./projects.css";
import { projectsArray } from "./projectsData.ts";


function Projects() {
  const language_page = useSelector((state: RootState) => state.language);
  return (
    <section id="projects" role="projects" className="projects">
      <h1>{language_page === "portuguese" ? <>Projetos</> : <>Projects</>}</h1>
      {language_page === "portuguese" ? (
        <>
          Desenvolvi mais de 30 projetos durante o curso da Trybe, sendo 4 deles
          em grupo.Todos desenvolvidos como parte do treinamento nas stacks
          acima.
        </>
      ) : (
        <>
          I developed more than 30 projects during the Trybe course, 4 of them
          in groups. All developed as part of the training in the stacks above.
        </>
      )}
      <table cellSpacing="15">
        <thead>
          <tr>
            <th>{ language_page === "portuguese" ? <>Ano</> : <>Year</>}</th>
            <th>{ language_page === "portuguese" ? <>Nome</> : <>Name</>}</th>
            <th>{ language_page === "portuguese" ? <>Descrição</> : <>Description</>}</th>
            <th>{ language_page === "portuguese" ? <>Principais Stacks</> : <>Built with</>}</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {projectsArray.map(
            ({ year, name, description, technologies, link }) => {
              return (
                <tr key={name} className="project">
                  <td>{year}</td>
                  <td>{name}</td>
                  {language_page === "portuguese" ? (
                    <td>{description.ptBr}</td>
                  ) : (
                    <td>{description.eng}</td>
                  )}
                  <td id="stacksTd">
                    <ul>
                      {technologies.map((tech) => {
                        return (
                          <li key={tech} className="projectStack">
                            {tech}
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td>
                    <a href={link} target="_blank">
                      <img src={githubPages} alt="gitHubIcon" />
                    </a>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </section>
  );
}

export default Projects;
