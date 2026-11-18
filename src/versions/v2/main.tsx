import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import LanguageProvider from "./context/LanguageProvider.tsx";
import VersionProvider from "./context/VersionProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <VersionProvider>
      <App />
    </VersionProvider>
  </LanguageProvider>
);
