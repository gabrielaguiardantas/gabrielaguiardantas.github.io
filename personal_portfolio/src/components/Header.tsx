import Contact_button from './Contact_button';
import styles from '../styles/Header.module.css';
import github from '../assets/github.svg';
import instagram from '../assets/instagram.svg';
import linkedin from '../assets/linkedin.svg';
import facebook from '../assets/facebook.svg';

function Header() {
    return (
        <div className={styles.container}>
            <h1>Gabriel Aguiar Dantas</h1>
            <h2>Desenvolvedor Web FullStack</h2>
            <p>Desenvolvo produtos web responsivos e multi-dispositivos</p>
            <ul>
                <li>
                    <Contact_button imgProps={ { img: github, alt: "github",
                    href: "https://github.com/gabrielaguiardantas"
                } }/>
                </li>
                <li>
                    <Contact_button imgProps={ { img: instagram, alt: "instagram",
                    href: "https://www.instagram.com/gabrielaguiardantas"
                } }/>
                </li>
                <li>
                    <Contact_button imgProps={ { img: linkedin, alt: "linkedin",
                    href: "https://www.linkedin.com/in/gabrielaguiardantas"
                } }/>
                </li>
                <li>
                    <Contact_button imgProps={ { img: facebook, alt: "facebook",
                    href: "https://www.facebook.com/gabriel.aguiardantas/"
                } }/>
                </li>
            </ul>
        </div>
    );
}

export default Header;