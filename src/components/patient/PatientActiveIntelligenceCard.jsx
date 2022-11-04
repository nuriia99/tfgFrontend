import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWeightScale, faSkullCrossbones, faPersonDotsFromLine } from '@fortawesome/free-solid-svg-icons'
import { getLenguage } from '../../services/lenguage'
import { useGlobalContext } from '../../hooks/useGlobalContext'

const PatientActiveIntelligenceCard = ({ ai, handleClick }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')

  return (
    <div className="patient_ai">
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
           <p className='value'>{ai.alcohol || ai.tabaquismo || ai.drogas.length > 0 ? 'Sí' : 'No'}</p>
          </div>
          <div className="patient_ai_container_item">
           <FontAwesomeIcon className='icon' icon={faPersonDotsFromLine}/>
           <p className='title'>{leng.alergias}: </p>
           <p className='value'>{ai.alergias.length > 0 ? 'Sí' : 'No'}</p>
          </div>
        </div>
        <div className="patient_ai_button">
          <button className='button_classic' onClick={handleClick}>{leng.infoCompleta}</button>
        </div>
    </div>
  )
}

export default PatientActiveIntelligenceCard
