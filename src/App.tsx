import "./App.css";
import Header from "./components/header";
import NavBar from "./components/nav-bar";
import Footer from "./components/footer";
import Main from "./components/main";
import { useEffect, useState } from "react";

const getViewPort = () => (window.innerWidth <= 1024 ? "mobile" : "desktop");

function App() {
  const [viewPort, setViewPort] = useState(getViewPort); // desktop | mobile

  useEffect(() => {
    const handleResize = () => setViewPort(getViewPort());
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
