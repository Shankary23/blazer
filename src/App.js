import React from "react";
import WildfireMap from "./components/WildfireMap";
import FireTrackerChecklist from "./components/Checklist";
import { useTranslation } from "react-i18next";
import Chatbot from "./components/chatbot";
import 'animate.css';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <nav style={{textAlign: "center"}}>
        <button onClick={() => changeLanguage("en")}>English</button>
        <button onClick={() => changeLanguage("es")}>Español</button>
        <button onClick={() => changeLanguage("cn")}>Chinese</button>
      </nav>
      
      <h1 style={{ textAlign: "center" }}>{t("title")}</h1>
      <WildfireMap />
      <FireTrackerChecklist />
      <Chatbot/>
    </div>
  );
}

export default App;
