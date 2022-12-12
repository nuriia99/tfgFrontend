import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const PrescriptionCard = ({ handleClickPrincipalComponent }) => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const currentDate = new Date()

  const [uniquePrescription, setUniquePrescription] = useState()

  useEffect(() => {
    setUniquePrescription(() => {
      const uniquePrescription = new Set()
      if (patientData.patient) {
        patientData.patient.prescripciones.forEach((prescription) => {
          if (new Date(prescription.fechaFinal).getTime() > currentDate.getTime()) uniquePrescription.add(prescription.principioActivo)
        })
      }
      return uniquePrescription
    })
  }, [patientData])

  return (
    <>
    <div className="panel">
      <div className="panel_row_header">
        <p>{leng.prescripcionesActuales}</p>
        <button id='prescriptions_button' name='prescriptions_button' onClick={() => handleClickPrincipalComponent('prescriptions_button')} className='button_plus'><FontAwesomeIcon id='prescriptions_button' name='prescriptions_button' className='icon' icon={faPlus}/></button>
      </div>
      {
        uniquePrescription
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
