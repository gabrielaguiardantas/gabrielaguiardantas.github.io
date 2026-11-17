import { useLanguage } from "../../context/language";
import "./versions.css";
import { versionsArray } from "./versionsData";

// dentro do iframe, avisa a v2 (página-mãe); aberta direto em /v1.html, vai para /
function backTo2026() {
  if (window.parent !== window) {
    window.parent.postMessage({ type: "switch-version", version: "v2" }, window.location.origin);
  } else {
    window.location.href = "/";
  }
}

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
              {/* exceção ao congelamento da v1 (D4): o card v2.0 leva de volta a 2026 */}
              <button disabled={current} onClick={backTo2026}>
                {current
                  ? isPortuguese ? "Atual" : "Current"
                  : isPortuguese ? "Voltar para 2026" : "Back to 2026"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Versions;
