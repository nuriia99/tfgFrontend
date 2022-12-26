import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const VisitsCard = ({ handleClickPrincipalComponent }) => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')

  const [appoitnments, setAppointments] = useState()

  useEffect(() => {
    const newPatient = { ...patientData.patient }
    const newAppointments = patientData.patient.citasPrevias.filter((a) => {
      let currentDay = new Date()
      currentDay = currentDay.setHours(0, 0, 0, 0)
      currentDay = new Date(currentDay)
      currentDay = currentDay.toISOString()
      return a.fecha > currentDay
    })
    newPatient.citasPrevias = newAppointments.sort((a, b) => {
      const date1 = new Date(a.fecha)
      const date2 = new Date(b.fecha)
      return date1 - date2
    })
    setAppointments(newPatient.citasPrevias)
    updatePatient(newPatient)
  }, [])

  useEffect(() => {
    setAppointments(patientData.patient.citasPrevias)
  }, [patientData])

  return (
    <>
      <div className="panel">
        {
          appoitnments
            ? <>
              <div className="panel_row_header">
                <p>{leng.visitasActuales}</p>
                <button id='visits_button' name='visits_button' onClick={() => handleClickPrincipalComponent('visits_button')} className='button_plus'><FontAwesomeIcon id='prescriptions_button' name='prescriptions_button' className='icon' icon={faPlus}/></button>
              </div>
              {
                appoitnments.map((cita, index) => {
                  return (
                    <div key={index} className="panel_row">{cita.especialidad}</div>
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

export default VisitsCard
