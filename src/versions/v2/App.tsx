import styles from "./App.module.css";
import Identity from "./components/identity";
import Main from "./components/main";

function App() {
  return (
    <div className={styles.app}>
      <Identity />
      <div className={styles.content}>
        <Main />
      </div>
    </div>
  );
}

export default App;
