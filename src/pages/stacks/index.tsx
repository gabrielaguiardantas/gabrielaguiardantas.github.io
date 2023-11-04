import { useSelector } from "react-redux";
import "./stacks.css";
import { RootState } from "../../types";
import { stacksArray } from "./stacksData";



function Stacks() {
  const languagePage = useSelector((state: RootState) => state.language);
  return (
    <section id="stacks" role="stacks" className="stacks">
      <h1>Stacks</h1>
      <h4>{ languagePage === "portuguese" ? <>Ferramentas estudadas e utilizadas em projetos:</> : <> Some technologies i've worked with:</>}</h4>
      <div>
        <ul className="languages">
          {stacksArray.map(({ img, alt }) => {
            return (
              <li key={alt}>
                <img src={img} alt={alt} height="55px" width="60px" />
                <p>{alt}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Stacks;
