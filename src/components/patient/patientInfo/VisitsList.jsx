import { React, useEffect, useState } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { getDate, getFormalName, getHour } from '../../../utils/utils'
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

  const deleteAppointment = async (index) => {
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
                            <th className='small'>Hora</th>
                            <th className='small'>{leng.fecha}</th>
                            <th className='big'>{leng.centro}</th>
                            <th className='big'>{leng.sanitario}</th>
                            <th className='big'>{leng.especialidad}</th>
                            <th className='big'>{leng.tipoVisita}</th>
                            <th className='small'></th>
                          </tr>
                          {
                            appointments.map((appointment, index) => {
                              return (
                                <tr key={index}>
                                  <td>{getHour(appointment.fecha)}</td>
                                  <td>{getDate(appointment.fecha)}</td>
                                  <td>{appointment.centro}</td>
                                  <td>{getFormalName(appointment.trabajador.nombre, appointment.trabajador.apellido1, appointment.trabajador.apellido2)}</td>
                                  <td>{appointment.especialidad}</td>
                                  <td>{appointment.tipoVisita}</td>
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
              : <AddAppointment quitAddAppointment={() => setShowAddAppointment(false)}/>
          }
        </div>
      </div>
    </>
  )
}

export default VisitsList
