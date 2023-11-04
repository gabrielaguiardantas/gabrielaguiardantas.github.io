import Contact_button from "../contact-button";
import styles from "./Header.module.css";
import github from "../../assets/github.svg";
import instagram from "../../assets/instagram.svg";
import linkedin from "../../assets/linkedin.svg";
import facebook from "../../assets/facebook.svg";
import LanguageButton from "../language-button";
import brazil from "../../assets/brazil.svg";
import uk from "../../assets/uk.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../types";

const languagePropsArray = [
  { img: brazil, alt: "portuguese" },
  { img: uk, alt: "english" },
];

const contactPropsArray = [
  {
    img: github,
    alt: "github",
    href: "https://github.com/gabrielaguiardantas",
  },
  {
    img: instagram,
    alt: "instagram",
    href: "https://www.instagram.com/gabrielaguiardantas",
  },
  {
    img: linkedin,
    alt: "linkedin",
    href: "https://www.linkedin.com/in/gabrielaguiardantas",
  },
  {
    img: facebook,
    alt: "facebook",
    href: "https://www.facebook.com/gabriel.aguiardantas/",
  },
];

function Header() {
  const language_page = useSelector((state: RootState) => state.language);
  return (
    <header className={styles.container}>
      <a href="/">Gabriel Aguiar Dantas </a>
      <div>
        <h2>
          {language_page === "portuguese" ? (
            <>Desenvolvedor Web FullStack</>
          ) : (
            <>FullStack Web Developer</>
          )}
        </h2>
        <ul className={styles.languageButtonUl}>
          {languagePropsArray.map(({ img, alt }) => {
            return (
              <li key={alt}>
                <LanguageButton
                  languageImgProps={{
                    img,
                    alt,
                  }}
                />
              </li>
            );
          })}
        </ul>
        <p>
          {language_page === "portuguese" ? (
            <>Desenvolvo produtos web responsivos e multi-dispositivos</>
          ) : (
            <>Developing web responsive and multi-device products</>
          )}
        </p>
      </div>
      <ul className={styles.contactsButtonUl}>
        {contactPropsArray.map(({ img, alt, href }) => {
          return (
            <li key={alt}>
              <Contact_button
                contactImgProps={{
                  img,
                  alt,
                  href,
                }}
              />
            </li>
          );
        })}
      </ul>
    </header>
  );
}

export default Header;
