import { settingsEs, settingsCa } from '../translations/settings'
import { patientEs, patientCa } from '../translations/patient'
import { homeEs, homeCa } from '../translations/home'
export const getLenguage = (lenguage, sec) => {
  let leng = null
  const sections = {
    settingsEs,
    settingsCa,
    patientEs,
    patientCa,
    homeEs,
    homeCa
  }
  if (lenguage === 'es') {
    leng = sections[sec + 'Es']
  } else {
    leng = sections[sec + 'Ca']
  }
  return leng
}
