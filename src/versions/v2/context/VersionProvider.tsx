import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "./language";
import { type Version, VersionContext } from "./version";
import styles from "./VersionProvider.module.css";

// versão ativa só durante a visita: um reload volta para a v2 (D3)
function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<Version>("v2");
  const { language } = useLanguage();
  const value = useMemo(() => ({ version, setVersion }), [version]);
  const isV1 = version === "v1";

  // com a v1 na frente, a v2 fica montada atrás (preserva a rolagem),
  // mas inerte (sem foco nem leitor de tela) e sem barra de rolagem própria
  useEffect(() => {
    if (!isV1) return;
    const root = document.getElementById("root")!;
    const html = document.documentElement;
    root.inert = true;
    html.style.overflow = "hidden";
    return () => {
      root.inert = false;
      html.style.overflow = "";
    };
  }, [isV1]);

  return (
    <VersionContext value={value}>
      {children}
      {isV1 &&
        createPortal(
          <iframe
            className={styles.frame}
            src={`/v1.html?lang=${language}`}
            title={language === "portuguese" ? "Portfólio, versão 1.0 (2023)" : "Portfolio, version 1.0 (2023)"}
          />,
          document.body,
        )}
    </VersionContext>
  );
}

export default VersionProvider;
