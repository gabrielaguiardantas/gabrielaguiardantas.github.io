import { useSelector } from "react-redux";
import { RootState } from "../../types";
import "./contact.css";

function Contact() {
  const language_page = useSelector((state: RootState) => state.language);
  return (
    <section id="contact" role="contact">
      <h1>{language_page === "portuguese" ? <>Contato</> : <>Contact</>}</h1>
      <p>{ language_page === "portuguese" ? <>Se interessou pelo meu trabalho? Me chame através das redes...</> : <>Having an exciting project? Send me a message on Linkedin...</>}</p>
      <a href="mailto:gabrielaguiardantas@gmail.com">
        <div className="letter-image">
          <div className="animated-mail">
            <div className="back-fold"></div>
            <div className="letter">
              <div className="letter-border"></div>
              <div className="letter-title"></div>
              <div className="letter-context"></div>
              <div className="letter-stamp">
                <div className="letter-stamp-inner"></div>
              </div>
            </div>
            <div className="top-fold"></div>
            <div className="body"></div>
            <div className="left-fold"></div>
          </div>
          <div className="shadow"></div>
        </div>
      </a>
      <br />
      <p>{ language_page === "portuguese" ? <>ou me mande um email.</> : <>or mail me</>}</p>
    </section>
  );
}

export default Contact;
