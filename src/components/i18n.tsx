import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "../locales/en.json";
import arTranslation from "../locales/ar.json";
i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: arTranslation,
    },
    en: {
      translation: enTranslation,
    },
  },
  lng: localStorage.getItem("authenticationapi") || "ar",
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
