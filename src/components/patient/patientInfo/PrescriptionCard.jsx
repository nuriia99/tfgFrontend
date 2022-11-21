import { React } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const PrescriptionCard = ({ handleClickPrincipalComponent }) => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')

  const uniquePrescription = new Set()
  if (patientData.patient) {
    patientData.patient.prescripciones.forEach((prescription) => {
      uniquePrescription.add(prescription.principioActivo)
    })
  }

  return (
    <>
    <div className="panel">
      <div className="panel_row_header">
        <p>{leng.prescripcionesActuales}</p>
        <button id='prescriptions_button' name='prescriptions_button' onClick={() => handleClickPrincipalComponent('prescriptions_button')} className='button_plus'><FontAwesomeIcon id='prescriptions_button' name='prescriptions_button' className='icon' icon={faPlus}/></button>
      </div>
      {
        patientData.patient
          ? <>
            {
              [...uniquePrescription].map((prescription, index) => {
                return (
                  <div key={index} className="panel_row">{prescription}</div>
                )
              })
            }
          </>
          : null
      }
    </div>
    </>
  )
}

export default PrescriptionCard
