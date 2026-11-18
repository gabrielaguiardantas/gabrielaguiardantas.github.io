import styles from "./App.module.css";
import Identity from "./components/identity";
import Stage from "./components/stage";

function App() {
  return (
    <div className={styles.app}>
      <Identity />
      <Stage />
    </div>
  );
}

export default App;
