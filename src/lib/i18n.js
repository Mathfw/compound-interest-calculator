import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import * as en_US from '../translations/en-US.json';
import * as pt_BR from '../translations/pt-BR.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en_US },
    pt: { translation: pt_BR }
  },
  lng: 'pt',
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;