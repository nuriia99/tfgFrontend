import { React, useEffect, useState } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { getDate, getHour, getName } from '../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import useDelete from '../../../hooks/useDelete'
import AddAppointment from './AddAppointment'

const VisitsList = () => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const appointments = patientData.patient.citasPrevias

  const { deleteData, data } = useDelete()

  const [newAppointments, setNewAppointments] = useState()
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const [modifying, setModifying] = useState()

  const deleteAppointment = async (index) => {
    console.log(appointments[index])
    await deleteData('/schedules/deleteAppointment/' + appointments[index]._id, { paciente: appointments[index].paciente, agenda: appointments[index].agenda })
    setNewAppointments(() => {
      const arr = [...patientData.patient.citasPrevias]
      arr.splice(index, 1)
      return arr
    })
  }
  useEffect(() => {
    if (data) {
      const newPatient = { ...patientData.patient }
      newPatient.citasPrevias = newAppointments
      updatePatient(newPatient)
    }
  }, [data])

  const handleClickAppointment = (index) => {
    setModifying(appointments[index])
    setShowAddAppointment(true)
  }

  return (
    <>
      <div className="visits">
        <div className="visits_container">
          {
            !showAddAppointment
              ? <>
                <button className='button_classic new_appointment_button' onClick={() => setShowAddAppointment(true)}>Crear cita</button>
                <div className="visits_container_table">
                  {
                    appointments
                      ? <table>
                        <tbody>
                          <tr>
                            <th>Hora</th>
                            <th>{leng.fecha}</th>
                            <th>{leng.centro}</th>
                            <th>{leng.sanitario}</th>
                            <th>{leng.especialidad}</th>
                            <th>{leng.tipoVisita}</th>
                            <th>{leng.motivo}</th>
                            <th></th>
                          </tr>
                          {
                            appointments.map((appointment, index) => {
                              return (
                                <tr key={index}>
                                  <td onClick={() => handleClickAppointment(index)}>{getHour(appointment.fecha)}</td>
                                  <td onClick={() => handleClickAppointment(index)}>{getDate(appointment.fecha)}</td>
                                  <td onClick={() => handleClickAppointment(index)}>{appointment.centro}</td>
                                  <td onClick={() => handleClickAppointment(index)}>{getName(appointment.trabajador.nombre, appointment.trabajador.apellido1, appointment.trabajador.apellido2)}</td>
                                  <td onClick={() => handleClickAppointment(index)}>{appointment.especialidad}</td>
                                  <td onClick={() => handleClickAppointment(index)}>{appointment.tipoVisita}</td>
                                  <td onClick={() => handleClickAppointment(index)}>{appointment.motivo}</td>
                                  <td><button type='button' onClick={() => { deleteAppointment(index) }} className='delete_appointment_button'><FontAwesomeIcon icon={faTrash}/></button></td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                      : null
                  }
                </div>
              </>
              : <AddAppointment type='paciente' modifying={modifying} quitAddAppointment={() => { setShowAddAppointment(false); setModifying() }}/>
          }
        </div>
      </div>
    </>
  )
}

export default VisitsList
