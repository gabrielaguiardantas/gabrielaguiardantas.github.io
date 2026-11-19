import { useLanguage } from "../../context/language";
import { useVersion } from "../../context/version";
import styles from "./sections.module.css";

const TEXT = {
  portuguese: {
    v1: { meta: "2023 · Versão original", action: "Voltar para 2023" },
    v2: { meta: "2026 · Versão atual", action: "Atual" },
  },
  english: {
    v1: { meta: "2023 · Original version", action: "Back to 2023" },
    v2: { meta: "2026 · Current version", action: "Current" },
  },
};

// o card v1.0 abre a v1 de 2023 por cima da v2 (Fase 1); a viagem no tempo é a Fase 4
function Versions() {
  const text = TEXT[useLanguage().language];
  const { switchVersion } = useVersion();
  return (
    <div className={styles.versions}>
      <div className={styles.version}>
        <h3>v1.0</h3>
        <p className={styles.meta}>{text.v1.meta}</p>
        <button type="button" onClick={() => switchVersion("v1")}>
          {text.v1.action}
        </button>
      </div>
      <div className={`${styles.version} ${styles.current}`}>
        <h3>v2.1</h3>
        <p className={styles.meta}>{text.v2.meta}</p>
        <button type="button" disabled>
          {text.v2.action}
        </button>
      </div>
    </div>
  );
}

export default Versions;
