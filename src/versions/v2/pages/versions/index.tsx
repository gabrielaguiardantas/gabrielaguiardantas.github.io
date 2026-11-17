import { useLanguage } from "../../context/language";
import "./versions.css";
import { versionsArray } from "./versionsData";

function Versions() {
  const languagePage = useLanguage().language;
  const isPortuguese = languagePage === "portuguese";
  return (
    <section id="versions" role="versions" className="versions">
      <h1>{isPortuguese ? <>Versões</> : <>Versions</>}</h1>
      <h4>
        {isPortuguese ? (
          <>Prefere outra versão do site? Escolha abaixo:</>
        ) : (
          <>Prefer another version of this site? Pick one below:</>
        )}
      </h4>
      <ul className="versionsList">
        {versionsArray.map(({ version, year, description, current }) => {
          return (
            <li key={version} className={current ? "currentVersion" : ""}>
              <h2>{version}</h2>
              <span>{isPortuguese ? year.ptBr : year.eng}</span>
              <p>{isPortuguese ? description.ptBr : description.eng}</p>
              {/* switch em runtime será implementado na próxima etapa */}
              <button disabled>
                {current
                  ? isPortuguese ? "Atual" : "Current"
                  : isPortuguese ? "Em breve" : "Coming soon"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Versions;
