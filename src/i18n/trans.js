import i18next from 'i18next';
import translations from './translations/index';

let __initialised = false;

export async function changeLanguage(lang) {
  await i18next.changeLanguage(lang);
}

export async function initialise() {
  await i18next.init({
    fallbackLng: 'en',
    debug: false,
    resources: Object.keys(translations).reduce(
      (output, lang) => ({
        ...output,
        [lang]: {
          translation: translations[lang]
        }
      }),
      {}
    )
  });
  __initialised = true;
}

export function onLanguageChanged(callback) {
  i18next.on('languageChanged', callback);
  return () => i18next.off('languageChanged', callback);
}

export function t(key, options) {
  if (!__initialised) return key;
  return i18next.t(key, options);
}
