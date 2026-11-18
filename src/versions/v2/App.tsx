import { useState } from "react";
import styles from "./App.module.css";
import Guide from "./components/guide";
import Identity from "./components/identity";
import Stage from "./components/stage";
import { useIntro } from "./components/stage/useIntro";
import { useRoute } from "./context/route";
import type { SectionId } from "./sections";

function App() {
  const route = useRoute();
  const intro = useIntro(route.view === "idle");
  // a seção apontada na órbita: o palco avisa, o guia explica
  const [pointed, setPointed] = useState<SectionId | null>(null);

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
