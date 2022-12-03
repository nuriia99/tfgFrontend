import { settingsEs, settingsCa } from '../translations/settings'
import { patientEs, patientCa } from '../translations/patient'
import { homeEs, homeCa } from '../translations/home'
import { prescriptionEs, prescriptionCa } from '../translations/prescriptions'
import { statisticsEs, statisticsCa } from '../translations/statistics'
export const getLenguage = (lenguage, sec) => {
  let leng = null
  const sections = {
    settingsEs,
    settingsCa,
    patientEs,
    patientCa,
    homeEs,
    homeCa,
    prescriptionEs,
    prescriptionCa,
    statisticsEs,
    statisticsCa
  }
  if (lenguage === 'es') {
    leng = sections[sec + 'Es']
  } else {
    leng = sections[sec + 'Ca']
  }
  return leng
}
