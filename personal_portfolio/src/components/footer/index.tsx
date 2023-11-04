import { useSelector } from "react-redux";
import { RootState } from "../../types";
import "./footer.css";

function Footer() {
  const language_page = useSelector((state: RootState) => state.language);
  return (
    <footer>
      <div>
        <p>
          {language_page === "portuguese" ? (
            <>
              Desenvolvido por mim, em
              {<a href="https://www.typescriptlang.org/"> Typescript</a>} no
              {<a href="https://code.visualstudio.com/"> Visual Studio Code</a>}
              , tendo como base {<a href="https://react.dev/"> React</a>} e
              {<a href="https://vitejs.dev/"> Vite</a>}. 
              &#169; 2023 Gabriel A. Dantas - Todos os direitos reservados. v1.0
            </>
          ) : ( 
            <>
              Developed by me in
              {<a href="https://www.typescriptlang.org/"> Typescript</a>} on
              {<a href="https://code.visualstudio.com/"> Visual Studio Code</a>}
              , having as base {<a href="https://react.dev/"> React</a>} and
              {<a href="https://vitejs.dev/"> Vite</a>}. &#169; 2023 Gabriel A. Dantas - All rights reserved. v1.0
            </>
          )}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
