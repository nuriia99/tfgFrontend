import { React, useEffect, useState } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { getDate, getHour, getName } from '../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation, faTrash } from '@fortawesome/free-solid-svg-icons'
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
  const [deleteIndex, setDeleteIndex] = useState()

  const deleteAppointment = async () => {
    const index = deleteIndex
    await deleteData('/schedules/deleteAppointment/' + appointments[index]._id, { paciente: appointments[index].paciente, agenda: appointments[index].agenda })
    setNewAppointments(() => {
      const arr = [...patientData.patient.citasPrevias]
      arr.splice(index, 1)
      return arr
    })
    setDeleteIndex()
  }
  useEffect(() => {
    if (data) {
      const newPatient = { ...patientData.patient }
      newPatient.citasPrevias = newAppointments
      updatePatient({ patient: newPatient })
    }
  }, [data])

  const handleClickAppointment = (index) => {
    setModifying(appointments[index])
    setShowAddAppointment(true)
  }

  return (
    <>
      <div className="visits">
        {
          deleteIndex || deleteIndex === 0
            ? <>
              <div className="overlay">
                <div className="overlay_box">
                  <FontAwesomeIcon icon={faCircleExclamation} className='icon'/>
                  <p>{leng.seguroVisita}</p>
                  <div className="overlay_box_buttons">
                    <button type='button' onClick={deleteAppointment} className='button_classic accept'>Eliminar</button>
                    <button type='button' onClick={() => setDeleteIndex()} className='button_classic cancel'>{leng.cancelar}</button>
                  </div>
                </div>
              </div>
            </>
            : null
        }
        <div className="visits_container">
          {
            !showAddAppointment
              ? <>
                <button className='button_classic new_appointment_button' onClick={() => setShowAddAppointment(true)}>{leng.consulta}</button>
                <div className="visits_container_table">
                  {
                    appointments
                      ? <div className="classic_table">
                        <table>
                          <thead>
                            <tr>
                              <th className='small'>Hora</th>
                              <th className='small'>{leng.fecha}</th>
                              <th className='small'>{leng.centro}</th>
                              <th>{leng.sanitario}</th>
                              <th className='small'>{leng.especialidad}</th>
                              <th className='small'>{leng.tipoVisita}</th>
                              <th>{leng.motivo}</th>
                              <th className='small'></th>
                            </tr>
                          </thead>
                          <tbody>
                          {
                            appointments.map((appointment, index) => {
                              return (
                                <tr className='visits_row' key={index}>
                                  <td className='small' onClick={() => handleClickAppointment(index)}>{getHour(appointment.fecha)}</td>
                                  <td className='small' onClick={() => handleClickAppointment(index)}>{getDate(appointment.fecha)}</td>
                                  <td className='small' onClick={() => handleClickAppointment(index)}>{appointment.centro}</td>
                                  <td onClick={() => handleClickAppointment(index)}>{getName(appointment.trabajador.nombre, appointment.trabajador.apellido1, appointment.trabajador.apellido2)}</td>
                                  <td className='small' onClick={() => handleClickAppointment(index)}>{appointment.especialidad}</td>
                                  <td className='small' onClick={() => handleClickAppointment(index)}>{appointment.tipoVisita}</td>
                                  <td onClick={() => handleClickAppointment(index)}>{appointment.motivo}</td>
                                  <td className='small' onClick={() => { setDeleteIndex(index) }}><button type='button' className='delete_appointment_button'><FontAwesomeIcon icon={faTrash}/></button></td>
                                </tr>
                              )
                            })
                          }
                          </tbody>
                        </table>
                      </div>
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
