import { useLanguage } from "../../context/language";
import styles from "./sections.module.css";

const EMAIL = "gabrielaguiardantas@gmail.com";

const TEXT = {
  portuguese: { intro: "Aberto a novas oportunidades como Desenvolvedor Full Stack. Vamos conversar?", email: "e-mail" },
  english: { intro: "Open to new opportunities as a Full Stack Developer. Let's talk?", email: "email" },
};

// só os canais oficiais (Fase 3)
function Contact() {
  const text = TEXT[useLanguage().language];
  const channels = [
    { label: "linkedin", href: "https://www.linkedin.com/in/gabrielaguiardantas", shown: "linkedin.com/in/gabrielaguiardantas" },
    { label: "github", href: "https://github.com/gabrielaguiardantas", shown: "github.com/gabrielaguiardantas" },
    { label: text.email, href: `mailto:${EMAIL}`, shown: EMAIL },
  ];
  return (
    <>
      <p>{text.intro}</p>
      <ul className={styles.contact}>
        {channels.map(({ label, href, shown }) => (
          <li key={href}>
            <span>{label}</span>
            <a href={href} {...(!href.startsWith("mailto:") && { target: "_blank", rel: "noopener noreferrer" })}>
              {shown}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Contact;
