import { React, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWeightScale, faSkullCrossbones, faPersonDotsFromLine } from '@fortawesome/free-solid-svg-icons'
import { getLenguage } from '../../../utils/lenguage'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'

const PatientActiveIntelligenceCard = ({ handleClick }) => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')

  const [ai, setAi] = useState()

  useEffect(() => {
    if (patientData.patient) {
      patientData.patient.inteligenciaActiva.forEach((item) => {
        switch (item[0]) {
          case 'Peso':
            setAi((prev) => { return { ...prev, peso: item.at(-1) } })
            break
          case 'Estatura':
            setAi((prev) => { return { ...prev, estatura: item.at(-1) } })
            break
          case 'Alcohol':
            setAi((prev) => { return { ...prev, alcohol: item.at(-1) } })
            break
          case 'Tabaquismo':
            setAi((prev) => { return { ...prev, tabaquismo: item.at(-1) } })
            break
          case 'Drogas':
            setAi((prev) => { return { ...prev, drogas: item.at(-1) } })
            break
          default:
            break
        }
      })
    }
  }, [patientData])

  return (
    ai
      ? <div className="patient_ai">
          <p className="patient_ai_title">{leng.inteligenciaActiva}</p>
            <div className="patient_ai_container">
              <div className="patient_ai_container_item">
                <FontAwesomeIcon className='icon' icon={faWeightScale}/>
                <p className='title'>IMC: </p>
                <p className='value'>{(ai.peso / (ai.estatura * 2 / 100)).toFixed(2) } kg/m²</p>
              </div>
              <div className="patient_ai_container_item">
                <FontAwesomeIcon className='icon' icon={faSkullCrossbones}/>
                <p className='title'>{leng.habitos}: </p>
                <p className='value'>{ai.alcohol !== '-' || ai.tabaquismo !== '-' || ai.drogas !== '-' ? 'Sí' : 'No'}</p>
              </div>
              <div className="patient_ai_container_item">
                <FontAwesomeIcon className='icon' icon={faPersonDotsFromLine}/>
                <p className='title'>{leng.alergias}: </p>
                <p className='value'>{ai.alergias !== '-' ? 'Sí' : 'No'}</p>
              </div>
            </div>
            <div className="patient_ai_button">
              <button id='ai_button' className='button_classic' onClick={handleClick}>{leng.infoCompleta}</button>
            </div>
        </div>
      : null
  )
}

export default PatientActiveIntelligenceCard
