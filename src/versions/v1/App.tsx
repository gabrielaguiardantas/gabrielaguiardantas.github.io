import "./App.css";
import Header from "./components/header";
import NavBar from "./components/nav-bar";
import Footer from "./components/footer";
import Main from "./components/main";
import { useSyncExternalStore } from "react";

const mobileQuery = window.matchMedia("(max-width: 1024px)");

function subscribeToViewPort(onChange: () => void) {
  mobileQuery.addEventListener("change", onChange);
  return () => mobileQuery.removeEventListener("change", onChange);
}

const getViewPort = () => (mobileQuery.matches ? "mobile" : "desktop");

function App() {
  const viewPort = useSyncExternalStore(subscribeToViewPort, getViewPort); // desktop | mobile

  return (
    <div className={viewPort}>
      <Header />
      <NavBar />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
