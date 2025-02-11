import React from "react";
import WildfireMap from "./components/WildfireMap";
import FireTrackerChecklist from "./components/Checklist";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <nav>
        <button onClick={() => changeLanguage("en")}>English</button>
        <button onClick={() => changeLanguage("es")}>Español</button>
      </nav>
      
      <h1 style={{ textAlign: "center" }}>{t("title")}</h1>
      <WildfireMap />
      <FireTrackerChecklist />
    </div>
  );
}

export default App;
