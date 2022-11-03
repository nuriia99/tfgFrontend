import { settingsEs, settingsCa } from '../translations/settings'
import { patientEs, patientCa } from '../translations/patient'
export const getLenguage = (lenguage, sec) => {
  let leng = null
  const sections = {
    settingsEs,
    settingsCa,
    patientEs,
    patientCa
  }
  if (lenguage === 'es') {
    leng = sections[sec + 'Es']
  } else {
    leng = sections[sec + 'Ca']
  }
  return leng
}
