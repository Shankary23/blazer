import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) 
  .use(initReactI18next) 
  .init({
    fallbackLng: 'en', 
    lng: 'en', 
    backend: {
      loadPath: 'http://localhost:3001/translations/{{lng}}.json', 
    },
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
