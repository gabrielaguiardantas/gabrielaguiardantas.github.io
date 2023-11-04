import "./App.css";
import Header from "./components/header";
import NavBar from "./components/nav-bar";
import Footer from "./components/footer";
import Main from "./components/main";
import { useEffect, useLayoutEffect, useState } from "react";

function App() {
  const [viewPort, setViewPort] = useState(""); // desktop | mobile

  useLayoutEffect(() => {
    if (window.innerWidth <= 1024) {
      setViewPort("mobile");
    } else {
      setViewPort("desktop");
    }
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setViewPort("mobile");
      } else {
        setViewPort("desktop");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div className={ viewPort === "mobile" ? "mobile" : "desktop"}>
      <Header />
      <NavBar />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
