import { useEffect, useState } from "react";
import styles from "./App.module.css";
import Guide from "./components/guide";
import Identity from "./components/identity";
import Stage from "./components/stage";
import { useIntro } from "./components/stage/useIntro";
import { useLanguage } from "./context/language";
import { useRoute } from "./context/route";
import { SECTIONS, type SectionId } from "./sections";

function App() {
  const route = useRoute();
  const intro = useIntro(route.view === "idle");
  // a seção apontada na órbita: o palco avisa, o guia explica
  const [pointed, setPointed] = useState<SectionId | null>(null);
  const { language } = useLanguage();

  // o título da aba diz onde se está, no histórico do navegador e para o leitor de tela
  useEffect(() => {
    const name = "Gabriel Aguiar Dantas";
    const section = route.view === "section" && SECTIONS.find(({ id }) => id === route.section);
    document.title = section ? `${section.label[language]} · ${name}` : name;
  }, [route, language]);

  return (
    <div className={styles.app}>
      <Identity>
        <Guide route={route} pointed={route.view === "orbit" ? pointed : null} hidden={intro.typing} />
      </Identity>
      <Stage route={route} intro={intro} onPoint={setPointed} />
    </div>
  );
}

export default App;
