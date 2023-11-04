import { useSelector } from "react-redux";
import { RootState } from "../../types";
import "./nav-bar.css";
import { useEffect } from "react";
import { handleClick, handleScroll } from "./nav-bar";

const NAV_SECTIONS = [{ eng: "about", ptBr: "sobre" }, { eng: "stacks", ptBr: "stacks" }, { eng: "projects", ptBr: "projetos" }, { eng: "contact", ptBr: "contato" }]

function NavBar() {
  const language_page = useSelector((state: RootState) => state.language);

  useEffect(() => {
    document.getElementById("a_about")?.classList.add("active");
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav>
      {
        NAV_SECTIONS.map(({ eng, ptBr}) => {
          return (
            <a key={eng} href={`#${eng}`} id={`a_${eng}`} onClick={handleClick}>
              {language_page === "portuguese" ? <>{ptBr}</> : <>{eng}</>}
            </a>
          )
        })
        }
    </nav>
  );
}

export default NavBar;
