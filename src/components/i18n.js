import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import es from "../locales/es.json";
import cn from "../locales/cn.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    cn: { translation: cn }

  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
