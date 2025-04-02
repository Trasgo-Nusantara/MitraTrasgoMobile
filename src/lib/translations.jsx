// filepath: /Users/hilmanzu/Documents/mobileReact/Trasgo/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {getLocales} from 'react-native-localize';
import en from './locales/en.json';
import id from './locales/id.json';
import cn from './locales/cn.json';


const resources = {
  en: { translation: en },
  id: { translation: id },
  cn: { translation: cn }

};

const fallback = { languageTag: 'en', isRTL: false };
const { languageTag } = getLocales(Object.keys(resources)) || fallback;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: languageTag,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export const setLocale = (locale) => {
  i18n.changeLanguage(locale);
};

export default i18n;