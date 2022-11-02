import { settingsEs, settingsCa } from '../translations/settings'
export const getLenguage = (lenguage, sec) => {
  let leng = null
  const sections = {
    settingsEs,
    settingsCa
  }
  if (lenguage === 'es') {
    leng = sections[sec + 'Es']
  } else {
    leng = sections[sec + 'Ca']
  }
  return leng
}
