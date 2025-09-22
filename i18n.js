import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'

const createI18nInstance = (lng = 'en', ns = 'common') => {
  const i18nInstance = createInstance()
  i18nInstance
    .use(initReactI18next)
    .init({
      lng,
      ns,
      fallbackLng: 'en',
      supportedLngs: ['en', 'hi', 'sat'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          common: require('./public/locales/en/common.json'),
        },
        hi: {
          common: require('./public/locales/hi/common.json'),
        },
        sat: {
          common: require('./public/locales/sat/common.json'),
        },
      },
    })

  return i18nInstance
}

export default createI18nInstance