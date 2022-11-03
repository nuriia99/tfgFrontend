import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWeightScale } from '@fortawesome/free-solid-svg-icons'
import { getLenguage } from '../../services/lenguage'
import { useGlobalContext } from '../../hooks/useGlobalContext'

const PatientActiveIntelligence = ({ ai }) => {
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
           <FontAwesomeIcon className='icon' icon={faWeightScale}/>
           <p className='title'>IMC: </p>
           <p className='value'>{(ai.peso / (ai.estatura * 2 / 100)).toFixed(2) } kg/m²</p>
          </div>
        </div>
        <div className="patient_ai_button">
          <button className='button_classic'>{leng.infoCompleta}</button>
        </div>
    </div>
  )
}
// habitos toxicos
// alergias
export default PatientActiveIntelligence
