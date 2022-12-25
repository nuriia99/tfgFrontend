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
      currentDay = currentDay.toISOString()
      return a.fecha > currentDay
    })
    newPatient.citasPrevias = newAppointments
    setAppointments(newAppointments)
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
                    <div key={index} className="panel_row">{cita.trabajador.nombre + ' - ' + cita.especialidad}</div>
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
